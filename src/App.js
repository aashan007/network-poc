import logo from './logo.svg';
import React,{useState,useEffect} from 'react';
// import {nx} from 'next-ui'
import Script from 'react-load-script'
import './App.css';

function App() {

  const [topologyData, setTopologyData] = useState();
  const [topology, setTopology] = useState();
  const [nxApp, setNxApp] = useState();

  const handleLoad = () => { 
    const tempApp = new window.nx.ui.Application()
    tempApp.container(document.getElementById('nxContainer'))
    setNxApp(tempApp);

    var topologyConfig = {
     	// width 100% if true
		'adaptive': false,
		// show icons' nodes, otherwise display dots
		'showIcon': true,
		// special configuration for nodes
		'nodeConfig': {
			'label': 'model.name',
			'iconType': "router",
			'color': '#0how00'
		},
		// special configuration for links
		'linkConfig': {
			'linkType': 'curve'
		},
		// property name to identify unique nodes
		'identityKey': 'name', // helps to link source and target
		// canvas size
		'width': 1000,
		'height': 600,
		// "engine" that process topology prior to rendering
		'dataProcessor': 'force',
		// moves the labels in order to avoid overlay
		'enableSmartLabel': true,
		// smooth scaling. may slow down, if true
		'enableGradualScaling': true,
		// if true, two nodes can have more than one link
		'supportMultipleLink': true,
		// enable scaling
		"scalable": true
  
    };
    
    const topology = new window.nx.graphic.Topology(topologyConfig) // topology config JSON object
    
    var data = {
      "nodes": [
        {
          "id": 0,
          "name": "San Francisco"
        },
        {
          "id": 1,
          "name": "Los Angeles"
        },
        {
          "id": 2,
          "name": "San Diego"
        },
        {
          "id": 3,
          "name": "Dallas"
        },
        {
          "id": 4,
          "name": "San Antonio"
        }
      ],
      // and links
      "links": [
        {
          "source": "San Francisco",
          "target": "Los Angeles"
        },
        {
          "source": "San Francisco",
          "target": "Dallas"
        },
        {
          "source": "San Antonio",
          "target": "Dallas"
        },
        {
          "source": "San Diego",
          "target": "Los Angeles"
        },
        {
          "source": "San Antonio",
          "target": "San Diego"
        }
      ]
    };

    topology.on("topologyGenerated", function() {

      var groupsLayer = topology.getLayer("groups");
      var nodesDict = topology.getLayer("nodes").nodeDictionary();
    
      var nodes1 = [nodesDict.getItem("San Francisco"), nodesDict.getItem("Los Angeles"), nodesDict.getItem("San Diego")];
      console.log(nodes1);
      var group1 = groupsLayer.addGroup({
        nodes: nodes1,
        label: 'California',
        color: '#f00',
        group: 'group1'
      });
    
      var nodes2 = [nodesDict.getItem("Dallas"), nodesDict.getItem("San Antonio")];
      var group2 = groupsLayer.addGroup({
        nodes: nodes2,
        label: 'Texas',
        color: '#0f0',
        id: 'group2'
      });
    
    });

    setTopology(topology);

    setTopologyData(data);
  }

  // Update the topology data if it changes
  useEffect(() => {
    if (!topology || !nxApp || !window.nx) {
      return;
    }
    topology.data(topologyData);
  }, [nxApp, topology, topologyData])

  // Attach the diagram once it's first loaded
  useEffect(() => {
    if (!topology || !nxApp || !window.nx) {
      return;
    }
    topology.attach(nxApp);
  }, [nxApp, topology])

  return (
    <div className="App">
      <h1>
        Network Topology
      </h1>
      <>
      <Script url="js/next.js"
        onError={() => console.log("Error!")}
        onLoad={handleLoad}
      />
   <div id="nxContainer"/>
</>
    </div>
  );
}

export default App;
