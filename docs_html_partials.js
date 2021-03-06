DocsHtmlPartials = [
  {
    name: "pioname",
    template: "PredictionIO-{{ pioversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "pioversion",
    template: "v{{ pioversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "pioversionnum",
    template: "0.9.7-aml",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "urversion",
    template: "v0.3.0",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsversion",
    template: "v{{hdfsversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkversion",
    template: "v{{ sparkversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "elasticsearchversion",
    template: "v{{ elasticsearchversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbaseversion",
    template: "v{{ hbaseversionnum}}",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsversionnum",
    template: "2.7.2",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkversionnum",
    template: "1.6.2",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "elasticsearchversionnum",
    template: "1.7.5",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbaseversionnum",
    template: "1.2.1",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hdfsdownload",
    template: "<a href='http://www.eu.apache.org/dist/hadoop/common/hadoop-2.7.2/hadoop-2.7.2.tar.gz'>Hadoop 2.7.2</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "sparkdownload",
    template: "<a href='http://www.us.apache.org/dist/spark/spark-1.6.2/spark-1.6.2-bin-hadoop2.6.tgz'>Spark 1.6.2</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "esdownload",
    template: "<a href='https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.5.tar.gz'>Elasticsearch 1.7.5</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: "hbasedownload",
    template: "<a href='http://www-us.apache.org/dist/hbase/1.2.2/hbase-1.2.2-bin.tar.gz'>HBase 1.2.2</a>",
    ismd: false,
    shouldLoad: false
  },
  {
    name: 'pio_version',
    template: 'PredictionIO-v0.9.7-aml',
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piosinglemachineguide",
    template: "- **[Single Machine](/docs/single_machine)**: This sets up a single machine to run all services but does so in a way that allows for easier cluster expansion in the future.",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piosmallhaguide",
    template: "- **[Small High Availability Cluster](/docs/small_ha_cluster)**: This sets up a 3 machine cluster with all services running on all machines with no single point of failure. This setup will allow you to expand by moving clustered services into their own cluster as needed. For instance Spark may be moved to separate machines for scaling purposes. ",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "piodistributedguide",
    template: "- **[Fully Distributed Clusters](/docs/single_driver_machine)**: This creates a 'Driver' machine that can run PIO when all services are in external clusters. This represents the ultimate in scalability since the clusters can be scaled independently.",
    ismd: true,
    shouldLoad: false
  },
  {
    name: "awssetupguide",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "pioawsguide",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "piosetupguides",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "urworkflow",
    template: "",
    ismd: true,
    shouldLoad: true
  },
  {
    name: "setsymlinks",
    template: "",
    ismd: true,
    shouldLoad: true
  }
]
