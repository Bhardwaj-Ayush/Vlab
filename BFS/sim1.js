import React, { useRef, useState } from 'react';
// import { DataSet, Network } from 'vis-network';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';


const BFSAlgorithm = () => {
  const [graph, setGraph] = useState([]);
  const [network, setNetwork] = useState(null);
  const [nextButtonClicked, setNextButtonClicked] = useState(false);

  const containerRef = useRef(null);

  // Function to generate the adjacency matrix based on the number of nodes
  const generateGraph = () => {
    const nodes = parseInt(document.getElementById('nodes').value);

    if (nodes >= 1) {
      const generatedGraph = generateRandomGraph(nodes);
      setGraph(generatedGraph);
      displayGraph(generatedGraph);
      clearOutput();
    } else {
      alert('Invalid input. Please enter a valid number of nodes.');
    }
  };

  // Function to generate a random graph
  const generateRandomGraph = (nodes) => {
    const generatedGraph = new Array(nodes).fill(0).map(() => new Array(nodes).fill(0));

    for (let i = 0; i < nodes; i++) {
      for (let j = i + 1; j < nodes; j++) {
        if (Math.random() < 0.5) {
          generatedGraph[i][j] = 1;
          generatedGraph[j][i] = 1;
        }
      }
    }

    return generatedGraph;
  };

  // BFS algorithm implementation
  const bfs = async (graph, start) => {
    const queue = [start];
    const visited = new Array(graph.length).fill(false);
    visited[start] = true;

    const path = [];
    let step = 0; // Variable to track the current step

    while (queue.length > 0) {
      const current = queue.shift();
      path.push(current);

      // Change node color to red and highlight visited node
      network.body.data.nodes.update({ id: current, color: { background: 'purple', border: 'purple' } });
      await sleep(1000); // Add a delay of 1 second
      network.body.data.nodes.update({ id: current, color: { background: 'grey', border: 'black' } });

      for (let i = 0; i < graph[current].length; i++) {
        if (graph[current][i] === 1 && !visited[i]) {
          queue.push(i);
          visited[i] = true;

          // Darken the edge color and highlight visited edge
          network.body.data.edges.update({ id: `${current}-${i}`, color: '#666666', font: { color: '#666666' } });
          await sleep(1000); // Add a delay of 1 second
          network.body.data.edges.update({ id: `${current}-${i}`, color: 'grey', font: { color: 'grey' } });
        }
      }

      step++; // Increment the step counter
      const output = document.getElementById('output');

      // Provide a description of the current step
      output.innerText = `Step ${step}: Visiting Node ${current}`;

      // If the "Next" button is clicked, pause execution until the next step
      if (await waitForNextStep()) {
        // Resume execution only if the "Next" button is clicked
        continue;
      }

      // If all steps are completed, exit the loop
      if (step === path.length) {
        break;
      }
    }

    return path;
  };

  // Function to create and display the graph visualization using vis.js
  const displayGraph = (graph) => {
    const container = containerRef.current;

    // Create an array of nodes
    const nodes = new DataSet(graph.map((_, index) => ({ id: index, label: String(index) })));

    // Create an array of edges
    const edges = [];
    for (let i = 0; i < graph.length; i++) {
      for (let j = i + 1; j < graph.length; j++) {
        if (graph[i][j] === 1) {
          edges.push({ id: `${i}-${j}`, from: i, to: j });
        }
      }
    }

    // Create a data object with nodes and edges
    const data = {
      nodes: nodes,
      edges: edges,
    };

    // Create options for the network visualization
    const options = {
      physics: false,
      edges: {
        color: {
          color: 'black',
        },
        font: {
          color: 'green',
        },
      },
    };

    // Create a network visualization
    const visNetwork = new Network(container, data, options);
    setNetwork(visNetwork);
    visNetwork.fit(); // Fit the graph to the container
  };

  // Run BFS algorithm and display the result
  const runBFS = async () => {
    const startNode = parseInt(document.getElementById('start').value);

    if (startNode >= 0 && startNode < graph.length) {
      const path = await bfs(graph, startNode);
      const output = document.getElementById('output');
      output.innerText = `BFS Path from Node ${startNode}: ${path.join(' -> ')}`;
    } else {
      alert('Invalid input. Please enter a valid node number.');
    }
  };

  // Function to handle the "Next" button click
  const nextStep = () => {
    setNextButtonClicked(true);
  };

  // Function to wait until the "Next" button is clicked
  const waitForNextStep = async () => {
    while (!nextButtonClicked) {
      await sleep(100); // Wait for 0.1 second
    }

    setNextButtonClicked(false); // Reset the variable
    return true; // Signal that the "Next" button is clicked
  };

  // Helper function to sleep for a given duration
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  // Function to clear the output text
  const clearOutput = () => {
    const output = document.getElementById('output');
    output.innerText = '';
  };

  return (
    <div>
      <div>
        <label htmlFor="nodes">Number of Nodes:</label>
        <input type="number" id="nodes" />
        <button onClick={generateGraph}>Generate Graph</button>
      </div>
      <div>
        <label htmlFor="start">Start Node:</label>
        <input type="number" id="start" />
        <button onClick={runBFS}>Run BFS</button>
        <button onClick={nextStep}>Next</button>
      </div>
      <div id="network" ref={containerRef}></div>
      <div id="output"></div>
    </div>
  );
};

export default BFSAlgorithm;
