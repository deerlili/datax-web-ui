<template>
  <div class="app-container">
    <RDBMSWriter v-show="dataSource!=='doris' && dataSource!=='hive' && dataSource!=='hbase' && dataSource!=='mongodb' && dataSource!=='txtfile'" ref="rdbmswriter" @selectDataSource="showDataSource" />
    <DorisWriter v-show="dataSource==='doris'" ref="doriswriter" @selectDataSource="showDataSource" />
    <HiveWriter v-show="dataSource==='hive'" ref="hivewriter" @selectDataSource="showDataSource" />
    <HBaseWriter v-show="dataSource==='hbase'" ref="hbasewriter" @selectDataSource="showDataSource" />
    <MongoDBWriter v-show="dataSource==='mongodb'" ref="mongodbwriter" @selectDataSource="showDataSource" />
    <TxtFileWriter v-show="dataSource=='txtfile'" ref="txtfilewriter" @selectDataSource="showDataSource" />
  </div>
</template>

<script>
import RDBMSWriter from './writer/RDBMSWriter'
import DorisWriter from './writer/DorisWriter'
import HiveWriter from './writer/HiveWriter'
import HBaseWriter from './writer/HBaseWriter'
import MongoDBWriter from './writer/MongoDBWriter'
import TxtFileWriter from './writer/TxtFileWriter'
export default {
  name: 'Writer',
  components: { RDBMSWriter, DorisWriter, HiveWriter, HBaseWriter, MongoDBWriter, TxtFileWriter },
  data() {
    return {
      dataSource: ''
    }
  },
  methods: {
    getData() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getData()
      } else if (this.dataSource === 'hbase') {
        return this.$refs.hbasewriter.getData()
      } else if (this.dataSource === 'mongodb') {
        return this.$refs.mongodbwriter.getData()
      } else if (this.dataSource === 'txtfile') {
        return this.$refs.txtfilewriter.getData()
      } else if (this.dataSource === 'doris') {
        return this.$refs.doriswriter.getData()
      } else {
        return this.$refs.rdbmswriter.getData()
      }
    },
    getTableName() {
      if (this.dataSource === 'hive') {
        return this.$refs.hivewriter.getTableName()
      } else if (this.dataSource === 'hbase') {
        return this.$refs.hbasewriter.getData()
      } else if (this.dataSource === 'mongodb') {
        return this.$refs.mongodbwriter.getData()
      } else if (this.dataSource === 'doris') {
        return this.$refs.doriswriter.getData()
      } else {
        return this.$refs.rdbmswriter.getTableName()
      }
    },
    getReaderData() {
      return this.$parent.getReaderData()
    },
    showDataSource(data) {
      this.dataSource = data
      this.getData()
    },
    sendTableNameAndColumns(fromTableName, fromColumnList) {
      this.$refs.hivewriter.fromTableName = fromTableName
      this.$refs.hivewriter.fromColumnList = fromColumnList
    }
  }
}
</script>
