<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.datasourceName"
        clearable
        placeholder="数据源名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="fetchData">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" min-width="95">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>
      <el-table-column label="数据源分组" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.datasourceGroup }}
        </template>
      </el-table-column>
      <el-table-column label="数据源名称" min-width="150" align="center">
        <template slot-scope="scope">{{ scope.row.datasourceName }}</template>
      </el-table-column>
      <el-table-column label="数据源类型" min-width="150" align="center">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>
      <el-table-column label="连接参数" align="center" min-width="120">
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            width="300"
            @show="getDatasourceParams(scope.row.connectionParams)"
          >
            <h5 v-html="datasourceParams" />
            <el-button slot="reference" size="small">查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="150" align="center">
        <template slot-scope="scope">{{ scope.row.comments }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px">
        
        <div style="margin-left: 30px;">
          <el-select slot="append"
            v-model="temp.type"
            placeholder="数据源类型"
            style="width: 200px"
            @change="selectDataSource(temp.type)"
          >
            <el-option v-for="item in dataSources" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>

        <div class="demo-input-suffix" style="margin-top: 10px;">
            
            <el-input v-model="temp.datasourceName" placeholder="数据源名称" style="margin-left: 30px;width: 40%">
              <template slot="prepend">数据源名称</template>
            </el-input>
          
            <el-input v-model="temp.datasourceGroup" placeholder="数据源分组" style="margin-left: 30px;width: 40%">
              <template slot="prepend">数据源分组</template>
            </el-input>
          
        </div>

        <div class="demo-input-suffix" style="margin-top: 10px;">
          <el-input v-if="jdbc" v-model="temp.connectionParams.user" placeholder="用户名" style="margin-left: 30px;width: 40%">
          <template slot="prepend">用&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;户&nbsp;&nbsp;名</template>
          </el-input>
          <el-input v-if="visible" v-show="jdbc" v-model="temp.connectionParams.password" type="password" placeholder="密码" style="margin-left: 30px;width: 40%">
            <template slot="prepend">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</template>
            <i slot="suffix" title="显示密码" style="cursor:pointer" class="el-icon-view" @click="changePass('show')" />
          </el-input>
          <el-input v-show="jdbc" v-else v-model="temp.connectionParams.password" type="text" placeholder="密码" style="margin-left: 30px;width: 40%">
            <template slot="prepend">密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</template>
            <i slot="suffix" title="隐藏密码" style="cursor:pointer" class="el-icon-check" @click="changePass('hide')" />
          </el-input>
        </div>

        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-if="jdbc" v-model="temp.connectionParams.jdbcUrl"  style="width: 88%">
           <template slot="prepend">JDBC-URL</template>
          </el-input>
        </div>

        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-if="mongodb" v-model="temp.connectionParams.jdbcUrl" placeholder="127.0.0.1:27017" style="width: 88%">
           <template slot="prepend">JDBC-URL</template>
          </el-input>
        </div>

        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-if="doris" v-model="temp.connectionParams.loadUrl" placeholder="fe_ip:fe_http_port,fe_ip:fe_http_port" style="width: 88%">
           <template slot="prepend">LOAD-URL</template>
          </el-input>
        </div>
        

        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-if="hbase" v-model="temp.connectionParams.zkAddress" placeholder="127.0.0.1:2181" style="width: 88%">
           <template slot="prepend">ZK&nbsp;&nbsp;&nbsp;地&nbsp;&nbsp;&nbsp;址</template>
          </el-input>
        </div>

        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-model="temp.connectionParams.database" style="width: 88%">
           <template slot="prepend">数据库名称</template>
          </el-input>
        </div>
        
        <div style="margin-top: 10px;margin-left: 30px;">
          <el-input v-model="temp.comments" style="width: 88%">
           <template slot="prepend">描&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;述</template>
          </el-input>
        </div>

      
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
        <el-button type="primary" @click="testDataSource()">
          测试连接
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPluginVisible" title="Reading statistics">
      <el-table :data="pluginData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as datasourceApi from '@/api/datax-jdbcDatasource'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'JdbcDatasource',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      dialogPluginVisible: false,
      pluginData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        datasourceName: [{ required: true, message: 'this is required', trigger: 'blur' }],
        type: [{ required: true, message: 'this is required', trigger: 'change' }],
        'connectionParams.user': [{ required: true, message: 'this is required', trigger: 'blur' }],
        'connectionParams.password': [{ required: true, message: 'this is required', trigger: 'blur' }],
        'connectionParams.jdbcUrl': [{ required: true, message: 'this is required', trigger: 'blur' }],
        'connectionParams.loadUrl': [{ required: true, message: 'this is required', trigger: 'blur' }],
        'connectionParams.zkAddress': [{ required: true, message: 'this is required', trigger: 'blur' }],
        'connectionParams.database': [{ required: true, message: 'this is required', trigger: 'blur' }]
      },
      temp: {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        connectionParams: {
          user: '',
          password: '',
          jdbcUrl: '',
          zkAddress: '',
          database: '',
          loadUrl: ''
        },
        user: '',
        password: '',
        jdbcUrl: '',
        zkAddress: '',
        database: '',
        loadUrl: '',
        type: '',
        comments: ''
      },
      visible: true,
      dataSources: [
        { value: 'MYSQL', label: 'MYSQL' },
        { value: 'DORIS', label: 'DORIS' },
        { value: 'ORACLE', label: 'ORACLE' },
        { value: 'POSTGRESQL', label: 'POSTGRESQL' },
        { value: 'GREENPLUM', label: 'GREENPLUM' },
        { value: 'SQLSERVER', label: 'SQLSERVER' },
        { value: 'HIVE', label: 'HIVE' },
        { value: 'CLICKHOUSE', label: 'CLICKHOUSE' },
        { value: 'DB2', label: 'DB2' },
        { value: 'OSCAR', label: 'OSCAR' },
        { value: 'HBASE', label: 'HBASE' },
        { value: 'MONGODB', label: 'MONGODB' }
      ],
      jdbc: true,
      hbase: false,
      mongodb: false,
      doris: false,
      datasourceParams: ''
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    selectDataSource(type) {
      if (type === 'MYSQL') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:mysql://{host}:{port}'
      } else if (type === 'DORIS') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:mysql://[host:port],[host:port]...'
      } else if (type === 'ORACLE') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:oracle:thin:@//{host}:{port}'
      } else if (type === 'POSTGRESQL') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:postgresql://{host}:{port}'
      } else if (type === 'GREENPLUM') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:postgresql://{host}:{port}'
      } else if (type === 'SQLSERVER') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:sqlserver://{host}:{port}'
      } else if (type === 'CLICKHOUSE') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:clickhouse://{host}:{port}'
      } else if (type === 'HIVE') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:hive2://{host}:{port}'
      } else if (type === 'DB2') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:db2://{host}[:{port}]/{database}'
      } else if (type === 'OSCAR') {
        this.temp.connectionParams.jdbcUrl = 'jdbc:oscar://{host}[:{port}]/{database}'
       }
      this.getShowStrategy(type)
    },
    fetchData() {
      this.listLoading = true
      datasourceApi.list(this.listQuery).then(response => {
        const { records } = response
        const { total } = response
        this.total = total
        this.list = records
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        datasourceName: '',
        datasourceGroup: 'Default',
        connectionParams: {
          user: '',
          password: '',
          jdbcUrl: '',
          zkAddress: '',
          database: '',
          loadUrl: ''
        },
        type: '',
        comments: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.user = this.temp.connectionParams.user
          this.temp.password = this.temp.connectionParams.password
          this.temp.jdbcUrl = this.temp.connectionParams.jdbcUrl
          this.temp.loadUrl = this.temp.connectionParams.loadUrl
          this.temp.zkAddress = this.temp.connectionParams.zkAddress
          this.temp.database = this.temp.connectionParams.database
          datasourceApi.created(this.temp).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '创建成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    testDataSource() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.user = this.temp.connectionParams.user
          this.temp.password = this.temp.connectionParams.password
          this.temp.jdbcUrl = this.temp.connectionParams.jdbcUrl
          this.temp.loadUrl = this.temp.connectionParams.loadUrl
          this.temp.zkAddress = this.temp.connectionParams.zkAddress
          this.temp.database = this.temp.connectionParams.database
          datasourceApi.test(this.temp).then(response => {
            if (response.data === false) {
              this.$notify({
                title: 'Fail',
                message: response.data.msg,
                type: 'fail',
                duration: 2000
              })
            } else {
              this.$notify({
                title: 'Success',
                message: '测试成功！',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    handleUpdate(row) {
      datasourceApi.fetched(row.id).then(response => {
        this.dialogStatus = 'update'
        this.getShowStrategy(row.type)
        this.temp = Object.assign({}, row)
        this.temp.connectionParams = JSON.parse(row.connectionParams)
         let responseParams = JSON.parse(response.connectionParams)
        this.temp.connectionParams.user = responseParams.user
        this.temp.connectionParams.password = responseParams.password
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.user = this.temp.connectionParams.user
          tempData.password = this.temp.connectionParams.password
          tempData.jdbcUrl = this.temp.connectionParams.jdbcUrl
          tempData.loadUrl = this.temp.connectionParams.loadUrl
          tempData.zkAddress = this.temp.connectionParams.zkAddress
          tempData.database = this.temp.connectionParams.database
          console.log(tempData)
          datasourceApi.updated(tempData).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    getShowStrategy(type) {
      if (type === 'HBASE') {
        this.jdbc = this.mongodb = this.doris = false
        this.hbase = true
      } else if (type === 'MONGODB') {
        this.jdbc = this.hbase = this.doris = false
        this.mongodb = true
        this.temp.jdbcUrl = 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]'
      } else if (type === 'DORIS') {
        this.jdbc = true
        this.doris = true
        this.temp.loadUrl = 'mongodb://[username:password@]host1[:port1][,...hostN[:portN]]][/[database][?options]]'
      } else {
        this.hbase = this.mongodb = this.doris = false
        this.jdbc = true
      }
    },
    handleDelete(row) {
      const idList = []
      idList.push(row.id)
      datasourceApi.deleted({ idList: row.id }).then(response => {
        this.fetchData()
        this.$notify({
          title: 'Success',
          message: '删除成功！',
          type: 'success',
          duration: 2000
        })
      })
      // const index = this.list.indexOf(row)
    },
    handleFetchPv(id) {
      datasourceApi.fetched(id).then(response => {
        this.pluginData = response
        this.dialogPvVisible = true
      })
    },
    changePass(value) {
      this.visible = !(value === 'show')
    },
    getDatasourceParams(param) {
      this.datasourceParams = param
    }
  }
}
</script>
