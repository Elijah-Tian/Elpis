const a = {
  model: "dashboard", // 模板类型，不同模板类型对应不一样的模板数据结构
  name: "", // 名称
  desc: "", // 描述
  icon: "", // 图标icon
  homePage: "", // 首页（项目配置）
  menu: [
    {
      key: "", //菜单唯一描述
      name: "", //菜单名称
      menuType: "", // 枚举值， group / module

      // 当 menuType == group 时，可填
      subMenu: [
        {
          // 可递归 menuItem
        },
      ],
      // 当 menuType == module 时，可填
      moduleType: "", // 枚举值： sider/iframe/custom/schema
      // 当 moduleType == sider 时
      siderConfig: {
        menu: [
          {
            // 可递归 menuItem(除 moduleType === sider)
          },
        ],
      },
      // 当 moduleType == iframe 时
      iframeConfig: {
        path: "", // iframe 路径
      },
      // 当 moduleType == custom 时
      cuntomConfig: {
        path: "", // 自定义路由路径
      },
      // 当 moduleType == schema 时
      schemaConfig: {
        api: "", // 数据源 API（遵循 RESTFUL 规范）
        schema: {
          // 板块数据结构
          type: "object",
          properties: {
            key: {
              ...schema, // 标准 schema 配置
              type: "", // 字段类型
              label: "", // 字段的中文名
              maxLength: Number, // 字段限制（最大长度）
              // 字段在 tabel 中的相关配置
              tableOption: {
                ...elTableColumnConfig, // 标准 el-table-column 配置
                toFixed: 0, // 保留小数点后几位
                visible: true, // 默认为 true（false时，表示不在表单中显示）
              },
              // 字段在 search-bar 中的相关配置
              searchOption: {
                ...eleComponentConfig, // 标准 el-component-config
                comType: "", // 配置组件类型 input/select/...
                default: "", // 默认值
                // 当 comType === 'select'
                enumList: [], // 下拉框可选项
                // 当 comType === 'dynamicSelect'
                api: "",
              },
              // 字段再不同动态 component 中的相关配置，前缀对应 componentComfig 中的键值
              // 如：componentConfig.createForm，这里对应 createFormOption
              // 字段在 createForm 中相关配置
              createFormOption: {
                ...eleComponentConfig, // 标准 el-component-config
                conType: "", //控件类型 input/select/input-number 等
                visible: true, // 是否展示 (true/false)，默认为 true
                disabled: false, // 是否禁用 (true/false)，默认为 false
                default: "", // 默认值

                // comType === 'select'时生效
                enumList: [], // 枚举列表
              },
              // 字段在 editForm 表单中的相关配置
              editFormOption: {
                ...eleComponentConfig, // 标准 el-component-config
                conType: "", //控件类型 input/select/input-number 等
                visible: true, // 是否展示 (true/false)，默认为 true
                disabled: false, // 是否禁用 (true/false)，默认为 false
                default: "", // 默认值

                // comType === 'select'时生效
                enumList: [], // 枚举列表
              },
              detailPanelOption:{
                ...eleComponentConfig, // 标准 el-component-config
              }
            },
          },
          required: [], // 标记哪些字段是必填项
        },
        // table 相关配置
        tableConfig: {
          headerButtons: [
            {
              label: "", // 按钮名
              eventKey: "", // 按钮事件名
              // 按钮具体配置
              eventOption: {
                // 当 eventKey === 'showComponent'
                comName: "", // 组件名称
              },
              ...elButtonConfig, // 标准的 el-button 配置
            },
          ],
          rowButtons: [
            {
              label: "", // 按钮名
              eventKey: "", // 按钮事件名
              eventOption: {
                // 当 eventKey === 'showComponent'
                comName: "", // 组件名称
                // 当 eventKey === 'remove'
                params: {
                  // paramKey = 参数的键值
                  // rowValueKey = 参数值，格式为 schema::xxx 的时候，在 table 中找相应字段
                  paramKey: rowValueKey,
                },
              }, // 按钮事件具体配置
              ...elButtonConfig, // 标准的 el-button 配置
            },
          ],
        },
        // search-bar 相关配置
        searchConfig: {},
        //  动态组件 相关配置
        componentConfig: {
          // create-form 表单相关配置
          createForm: {
            title: "", // 表单标题
            saveBtnText: "", // 保存按钮文案
          },
          // edit-form 表单相关配置
          editForm: {
            mainKey: "", // 表单逐渐，用于唯一标识要修改的数据对象
            title: "", // 表单标题
            saveBtnText: "", // 保存按钮文案
          },
          // detail-panel 相关配置
          detailPanel:{
            mainKey: "", // 表单逐渐，用于唯一标识要修改的数据对象
            title: "", // 表单标题
          }
          // 支持用户动态拓展
        },
      },
    },
  ],
};
