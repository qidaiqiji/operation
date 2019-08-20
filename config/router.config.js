export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        redirect: '/dashboard/analysis',
        // routes: [
        //   {
        //     path: '/dashboard/analysis',
        //     name: 'analysis',
        //     component: './Dashboard/Analysis',
        //   },
        //   {
        //     path: '/dashboard/monitor',
        //     name: 'monitor',
        //     component: './Dashboard/Monitor',
        //   },
        //   {
        //     path: '/dashboard/workplace',
        //     name: 'workplace',
        //     component: './Dashboard/Workplace',
        //   },
        // ],
      },
      {
        name: 'purchase',
        icon: 'shopping-cart',
        hideInMenu: true,
        path: '/form',
        routes: [
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
        ],
      },
      {
        name: 'markCenter',
        icon: 'table',
        path: '/markCenter',
        routes: [
          {
            path: '/markCenter/ActivitySummary',
            name: 'activitySummary',
            component: './MarkCenter/ActivitySummary',
          },
          {
            path: '/markCenter/create',
            name: 'create',
            component: './MarkCenter/Create',
          },
          {
            path: '/markCenter/activityDetails/:type/:id',
            name: 'activityDetails',
            hideInMenu: true,
            component: './MarkCenter/ActivityDetails',
          },
          {
            path: '/markCenter/event-manage',
            name: 'event-manage',
            component: './MarkCenter/EventManage',
          },
          {
            path: '/markCenter/step-form',
            name: 'stepform',
            hideInMenu: true,
            component: './MarkCenter/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/markCenter/step-form',
                hideInMenu: true,
                redirect: '/markCenter/step-form/info',
              },
              {
                path: '/markCenter/step-form/info/:type/:id?/:copy?',
                name: 'info',
                component: './MarkCenter/StepForm/Info',
              },
              {
                path: '/markCenter/step-form/confirm/:type/:id/:oldId?',
                name: 'confirm',
                component: './MarkCenter/StepForm/Confirm',
              },
              {
                path: '/markCenter/step-form/over/:type/:id',
                name: 'over',
                component: './MarkCenter/StepForm/Over',
              },
            ],
          },
          //创建优惠券
          {
            path: '/markCenter/CreateCoupons',
            name: 'CreateCoupons',
            hideInMenu: true,
            component: './MarkCenter/CreateCoupons/CreateCoupons',
          },
          // 兑奖中心
          {
            path: '/markCenter/cash-prize-manage',
            name: 'cash-prize-manage',
            hideInMenu: true,
            // component: './MarkCenter/CashPrizeManage',
            // hideChildrenInMenu: true,
            routes: [
              {
                path: '/markCenter/cash-prize-manage',
                hideInMenu: true,
                // name: 'cash-prize-center',
                redirect: '/markCenter/cash-prize-manage/cash-prize-center',
              },
              {
                path: '/markCenter/cash-prize-manage/cash-prize-center',
                name: 'cash-prize-center',
                component: './MarkCenter/CollarPrizeManage/CashPrizeCenter',
              },
              
            ],
          },
          {
            path: '/markCenter/collar-ticket',
            name: 'collar-ticket',
            component: './MarkCenter/CollarTicket',
            hideInMenu: true,
            // hideChildrenInMenu: true,
            routes: [
              {
                path: '/markCenter/collar-ticket',
                hideInMenu: true,
                redirect: '/markCenter/collar-ticket/info',
              },
              {
                // path: '/markCenter/collar-ticket/info/:type/:id?',
                path: '/markCenter/collar-ticket/info',
                name: 'info',
                component: './MarkCenter/CollarTicket/Info',
              },
              {
                // path: '/markCenter/collar-ticket/confirm/:type/:id',
                path: '/markCenter/collar-ticket/confirm',
                name: 'confirm',
                component: './MarkCenter/CollarTicket/Confirm',
              },
              {
                // path: '/markCenter/collar-ticket/over/:type/:id',
                path: '/markCenter/collar-ticket/over',
                name: 'over',
                component: './MarkCenter/CollarTicket/Over',
              },
            ],
          },

        ],
      },
      {
        name: 'pagesManagement',
        path: '/pages-management',
        icon:'appstore',
        routes:[
          {
            path: '/pages-management/create-card',
            name: 'createCard',
            component: './PagesManagement/CreateCard/CreateCard',
          },
          {
            path: '/pages-management/activity-page-list',
            name: 'activityPageList',
            component: './PagesManagement/ActivityPageList/ActivityPageList',
          },
          {
            path: '/pages-management/create-pages/:type?/:id?/:edit?/:copy?',
            name: 'createPages',
            inherited:true,
            hideInMenu:true,
            component: './PagesManagement/CreatePages/CreatePages',
          },
          {
            path: '/pages-management/a-type-model/:type?/:id?/:edit?/:copy?/:oldId?',
            name: 'aTypeModel',
            hideInMenu:true,
            inherited:true,
            component: './PagesManagement/ATypeModel/ATypeModel',
          },
          {
            path: '/pages-management/b-type-model/:type?/:id?/:edit?/:copy?/:oldId?',
            name: 'bTypeModel',
            inherited:true,
            hideInMenu:true,
            component: './PagesManagement/BTypeModel/BTypeModel',
          },
        ]
      },
      {
        path: '/list',
        icon: 'table',
        hideInMenu: true,
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        // hideInMenu: true,
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            // hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        hideInMenu: true,
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        hideInMenu: true,
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        hideInMenu: true,
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            hideInMenu: true,
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
