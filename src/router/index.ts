import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { useSorted } from '@vueuse/core'
// 步骤2： 解析单个路由的配置
type ConfigMeta = {
  title: string
  icon: string
  requiresAuth?: boolean
  order: number
  isDynamic?: boolean
}
export type ExtendedRouteRecordRaw = RouteRecordRaw & {
  meta: ConfigMeta
}

const loadDynamicRoutes = async (): Promise<ExtendedRouteRecordRaw[]> => {
  // 步骤一：批量读取所有.vue和config.json配置
  // 读取所有.vue组件（懒加载）的文件地址
  const componentModules = import.meta.glob('/src/views/**/*.vue')

  // 读取所有config.json(同步加载，用于获取meta等配置);
  const configModules = import.meta.glob('/src/views/**/config.json', {
    eager: true,
  })

  /**
   * 解析单个文件夹的路由信息
   * @param folderPath 文件夹路径（如 '@/views/profile'）
   * @returns 路由的基础配置（path/name/meta）+ 组件
   */
  const parseRoute = (
    folderPath: string,
  ): { route: ConfigMeta; component: any } => {
    // folderPath: @/views/404
    // @/views/404 => /src/views/404
    const folderPathReal = `${folderPath.replace('@', '/src')}`
    // 1. 读取当前文件夹的config.json
    const configPath = `${folderPathReal}/config.json`
    // 读取 configPath地址文件的配置json
    const config = (configModules[configPath] as { default: ConfigMeta })
      .default

    // 2. 读取当前文件夹的.vue组件（匹配文件夹下的任意文件） "/src/views/404/NotFound.vue"
    //folderPath @/views/404

    // 通过 folderPathReal /src/views/404 来匹配出 "/src/views/404/NotFound.vue"的地址
    const componentPath = Object.keys(componentModules).find(
      (path) => path.startsWith(folderPathReal) && path.endsWith('.vue'),
    )

    if (!componentPath) {
      throw new Error(`No .vue component found in ${folderPathReal}`)
    }
    // 通过componentPath获取 组件的地址映射 import("/src/views/404/NotFound.vue")
    const component = componentModules[componentPath]
    console.log('componentPath23', component)
    return {
      route: config,
      component,
    }
  }
  // 步骤3：递归生成嵌套路由
  /**
   * 递归构建嵌套路由
   * @param parentFolder 父文件夹路径（如 '@/views/profile'）
   * @returns 当前文件夹下的所有路由（包含children）
   */

  const buildNestedRoutes = (
    parentFolder: string,
    isChild: boolean,
  ): ExtendedRouteRecordRaw[] => {
    // @/views/profile => /src/views/profile
    const parentFolderReal = `${parentFolder.replace('@', '/src')}`
    // 1. 获取当前父文件夹下的所有子文件夹（用于找子路由）
    // 匹配父文件夹下的子文件夹（如 '@/views/profile/user'）

    // "/src/views/404/config.json"   @/views/404
    // 获取页面的文件名 ： /src/views/profile/user => user
    const dirName = parentFolder.split('/').pop() as string
    console.log('Object.keys(configModules)', parentFolderReal, typeof dirName)

    // 匹配出有子路由的文件夹 如果有则是一个数组，若不存在,返回 [];
    const childFolders = Object.keys(configModules)
      .filter(
        (configPath) =>
          // /src/views/profile/config.json含有  /src/views/profile/ 并且必须是6的长度才行， 5是父路由，6是含子路由
          configPath.startsWith(parentFolderReal + '/') &&
          configPath.split('/').length ===
            parentFolderReal.split('/').length + 2,
      )
      .map((configPath) => configPath.replace('/config.json', ''))

    // 2. 解析当前路由的基础信息
    const { route, component } = parseRoute(parentFolderReal)

    const currentRoute: ExtendedRouteRecordRaw = {
      path: '',
      name: '',
      component,
      meta: route,
      children: [] as ExtendedRouteRecordRaw[],
      // 先不添加children字段，后续根据子路由数量决定
    }
    let myPath = ''
    let myName = ''
    // 如果有子路由就是 {path:"prifile",name:"prifile"} 没有就是 {path:"/prifile",name:"prifile"}
    if (isChild) {
      myPath = dirName
      myName = dirName
    } else {
      myPath =
        dirName == '404'
          ? '/:pathMatch(.*)*'
          : route.order == 1
            ? '/'
            : route.isDynamic
              ? '/' + `${dirName}/:${route.title}`
              : '/' + dirName
      myName = dirName == '404' ? 'NotFound' : dirName
    }
    currentRoute.name = myName
    currentRoute.path = myPath

    // 3.只有当有子文件时，才递归生成children
    if (childFolders.length > 0) {
      // 递归创建子路由
      childFolders.forEach((childFolder) => {
        const childRoutes = buildNestedRoutes(childFolder, true)
        currentRoute.children!.push(...childRoutes)
      })
      console.log(
        'currentRoute',
        currentRoute,
        dirName,
        parentFolderReal,
        currentRoute.component,
        currentRoute.meta &&
          parentFolderReal + '/' + currentRoute.meta.name + '.vue',
      )
      // 4.如何目录名为父路由的目录名
      if (currentRoute.meta?.title.toString().toLowerCase() === dirName) {
        currentRoute.children!.unshift({
          path: '',
          name: dirName + 'Index',
          meta: currentRoute.meta,

          component: currentRoute.component,
        } as ExtendedRouteRecordRaw)
      }
      currentRoute.component = undefined
    }

    // 将子文件夹解析为 RouteConfig 列表，若没有子文件夹返回空数组
    return [currentRoute]
  }

  // 步骤4：生成顶级路由（更目录下的文件）
  // 获取所有顶级文件夹（views下的直接子文件夹）

  // '/src/views/404/config.json'

  const topLevelFolders = Object.keys(configModules)
    // 如 '@/views/home/config.json' 是4级路径
    .filter((configPath) => configPath.split('/').length === 5)
    .map((configPath) => configPath.replace('/config.json', ''))
    .map((configPath) => configPath.replace('/src', '@'))
  // ['/src/views/404', '/src/views/home', '/src/views/nftpage', '/src/views/profile', '/src/views/sellnft']
  // 生成所有顶级路由+递归子路由
  let routes: ExtendedRouteRecordRaw[] = []
  topLevelFolders.forEach((folder) => {
    routes = routes.concat(buildNestedRoutes(folder, false))
  })
  const sortRoutes = useSorted(routes, (a, b) => a.meta.order - b.meta.order)

  // 按照meta.order排序
  return sortRoutes.value // 赋值给全局变量
}
//

// 使用 Vueuse的ref存储路由状态
export const routeState: {
  allRoutes: Ref<ExtendedRouteRecordRaw[]>
  visibleRoutes: ComputedRef<ExtendedRouteRecordRaw[]>
  initRouter: () => Promise<ReturnType<typeof createRouter>>
} = {
  // 存储所有路由(包括静态路由)
  allRoutes: ref<ExtendedRouteRecordRaw[]>([]),

  // 存储过滤后的可见路由
  visibleRoutes: computed(() => {
    const allRoutesRef = routeState.allRoutes as Ref<ExtendedRouteRecordRaw[]>
    return allRoutesRef.value.filter(
      (route: ExtendedRouteRecordRaw) => route.name !== 'NotFound',
    )
  }),

  // 初始化路由
  async initRouter() {
    const dynamicRoutes = await loadDynamicRoutes()
    console.log('loadDynamicRoutes', dynamicRoutes)
    const router = createRouter({
      history: createWebHashHistory(),
      routes: [...dynamicRoutes] as RouteRecordRaw[],
    })
    routeState.allRoutes.value = router.options
      .routes as ExtendedRouteRecordRaw[]
    router.beforeEach((_to, _from, next) => {
      next()
    })
    return router
  },
}

// 默认导出改为异步函数
export default routeState.initRouter
