
import * as d3 from "https://cdn.skypack.dev/d3@7";
import {scaleOrdinal} from "https://cdn.skypack.dev/d3-scale@4";
import {schemeCategory10} from "https://cdn.skypack.dev/d3-scale-chromatic@3";
import * as apiserver from "./apiserver.js";

let svgcontainer = document.querySelector('.svg-container');
let width = svgcontainer.offsetWidth;
let height = svgcontainer.offsetHeight;

let radius = {
    scope: 20,
    resource: 10
};
let nodes = [];
let links = [];
let nodeColors = () => "black";

var svg = d3.select('.content').append("svg");
svg.attr('preserveAspectRatio', 'xMinYMin meet');
svg.attr('width', width).attr('height', height)

window.onresize = () => {
    width = svgcontainer.offsetWidth;
    height = svgcontainer.offsetHeight;
    svg.attr('width', width).attr('height', height);
}

export async function update(config) {
    document.querySelector('.svg-container svg').replaceChildren();
    if (config.selection === "definitions") {
        let res = await apiserver.getDefinitions(config.includedLinks, config.groups, config.scopeFilter);
        nodes = res.nodes;
        links = res.links;
    } else if (config.selection === "instances") {
        let res = await apiserver.getInstances(config.includedLinks, config.groups, config.scopeFilter);
        nodes = res.nodes;
        links = res.links;
    } else {
        nodes = [];
        links = [];
    }

    nodeColors = scaleOrdinal(schemeCategory10).domain(nodes.filter(n => n.scopeId).map(n => n.scopeId))
    simulate();
    initZoom();
}

function simulate() {
    var i = 0;
    let linkForce = d3.forceLink()
        .links(links)
        .id((node) => node.id )
        .strength((link) => {
            if (link.kind === "scope") {
                return 1;
            } else if (link.kind === "soft") {
                return 0.01;
            } else if (link.kind === "hard") {
                return 0.5;
            }
            return 0;
        })
        .distance((link) => {
            if (link.kind === "scope") {
                return radius.scope * 3;
            } else if (link.kind === "soft") {
                return radius.scope * 10;
            } else if (link.kind === "hard") {
                return radius.scope * 10;
            }
            return 0;
        })
       

    let simulation = d3.forceSimulation(nodes)
        .force('link', linkForce)
        .force('charge', d3.forceManyBody())
        //.force("charge", d3.forceManyBody().strength( n => (n.scopeId ? -10 : -100)))
        .force('collision', 
            d3.forceCollide().radius((n,i) => n.scopeId ? radius.resource : radius.scope))
        .force('center', d3.forceCenter(width / 2, height / 2));
    renderSimulation(simulation);
    
}

function renderSimulation(simulation) {
    let dragDrop = d3.drag()
        .on('start', (event, node) => {
            node.fx = node.x;
            node.fy = node.y;
        })
        .on('drag', (event, node) => {
            simulation.alphaTarget(0.3).restart();
            node.fx = event.x;
            node.fy = event.y;
        })
        .on('end', (event, node) => {
            if (!event.active) {
                simulation.alphaTarget(0);
            }
            node.fx = null;
            node.fy = null;
        });

    let linkElements = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function(link) { 
            if (link.kind === "scope") {
                return 1;
            } else {
                return 2;
            }
        })
        .attr("stroke-dasharray", function(link) {
            if (link.kind === "scope") {
                return "5,5";
            } else if (link.kind === "soft") {
                return "2, 2";
            }
        })
        .attr("stroke", function(link) { return getLinkColor(link);});

    let nodeElements = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", (d) => d.scopeId ? radius.resource : radius.scope)
        .attr("fill", getNodeColor)
        .attr("data-toggle", "modal")
        .attr("data-target", "#exampleModal")
        .call(dragDrop);

    let textElements = svg.append("g")
        .attr("class", "texts")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .text(function (node) { return node.title })
        .attr("font-size", 15)
        .attr("dx", 15)
        .attr("data-toggle", "modal")
        .attr("data-target", "#exampleModal")
        .attr("dy", 4);


    simulation.on("tick", function() { onTick.call(this, nodeElements, linkElements, textElements); })
}

function getNodeColor(node) {
    return nodeColors(node.scopeId || node.id);
}


function getLinkColor(link) {
    if (link.kind === "scope") {
        return "rgba(50, 50, 50, 0.2)";
    } else {
        return "rgba(20,20,20,1)";
    }
}

// Zoom functionality
let zoom = d3.zoom().on('zoom', handleZoom);

function initZoom() {
    d3.select('svg').call(zoom);
}

function handleZoom(e) {
    d3.selectAll('svg g').attr('transform', e.transform);
}


	  
function onTick(node, link, text) {
	// let alpha = this.alpha();
    // let chargeStrength = (n) => {
    //     if (alpha < 0.2) {
    //         return 0;
    //     } else if ( alpha > 0.9 ) {
    //         return  20;
    //     } else if ( alpha > 0.8 ) {
    //         return  10;
    //     }

    //     if (!n.scopeId) {
    //         return 1;
    //     } else if ( alpha > 0.2 ) {
    //         return (alpha - 0.2 / 0.6);
    //     } else {
    //         return 0;
    //     }    
    // }

	// this.force("charge", d3.forceManyBody()
    //     .distanceMax(600)
    //     .strength( n => (n.scopeId ? -100 : -100) * chargeStrength(n)));
	
	
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });

    text
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y; })
}
