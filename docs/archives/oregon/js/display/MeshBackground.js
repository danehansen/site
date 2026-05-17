"use strict";

function MeshBackground(container)
{
	this._settings=
	{
		mesh:
		{
			width:1.2,
			height:1.2,
			depth:10,
			rowWidth:300,
			columnHeight:300,
			xRange:0.29,
			yRange:0.1,
			zRange:1.0,
			ambient:"#3E3D3D",
			diffuse:"#525050",
			speed:0.0003
		},
		light:
		{
			count:2,
			xyScalar:1,
			zOffset:116,
			ambient:"#000000",
			diffuse:"#434343",
			speed:0.001,
			gravity:1200,
			dampening:0.95,
			minLimit:10,
			maxLimit:null,
			minDistance:200,
			maxDistance:400,
			autopilot:false,
			bounds:FSS.Vector3.create(),
			step:FSS.Vector3.create(
					Math.randomInRange(0.2, 1.0),
					Math.randomInRange(0.2, 1.0),
					Math.randomInRange(0.2, 1.0)
				)
		}
	};
	this._onMouseMoveHandler=MyUtils.bind(this._onMouseMove,this);
	this._width;
	this._height;
	this._geometry;
	this._mesh;
	this._now, this._start=Date.now();
	this._container=container;
	this._renderer=new FSS.CanvasRenderer();
	this._material=new FSS.Material(this._settings.mesh.ambient,this._settings.mesh.diffuse);
	this._scene=new FSS.Scene();
	this._center=FSS.Vector3.create();
	this._attractor=FSS.Vector3.create();
	this._container.appendChild(this._renderer.element);
	this._createLights();
	this._onTickHandler=MyUtils.bind(this._onTick,this);
	TweenLite.ticker.addEventListener("tick",this._onTickHandler,this);
	document.addEventListener('mousemove', this._onMouseMoveHandler);
}

MeshBackground.prototype._createLights=function()
{
	for(var i=0; i<this._settings.light.count; i++)
	{
		var light=new FSS.Light(this._settings.light.ambient,this._settings.light.diffuse);
		light.ambientHex=light.ambient.format();
		light.diffuseHex=light.diffuse.format();
		this._scene.add(light);
		// Augment light for animation
		light.mass=Math.randomInRange(0.5, 1);
		light.velocity=FSS.Vector3.create();
		light.acceleration=FSS.Vector3.create();
		light.force=FSS.Vector3.create();
	}
}

MeshBackground.prototype.onResize=function()
{
	this._width=window.innerWidth;
	this._height=window.innerHeight;
	this._renderer.setSize(this._width,this._height);
	FSS.Vector3.set(this._center, this._renderer.halfWidth, this._renderer.halfHeight);
	this._createMesh();
}

MeshBackground.prototype._createMesh=function()
{
	this._scene.remove(this._mesh);
	this._geometry=new FSS.Plane(this._width*this._settings.mesh.width, this._height*this._settings.mesh.height, Math.round(this._width/this._settings.mesh.rowWidth), Math.round(this._height/this._settings.mesh.columnHeight));
	this._mesh=new FSS.Mesh(this._geometry,this._material);
	this._scene.add(this._mesh);
	for(var i=0, iLen=this._geometry.vertices.length; i<iLen; i++)
	{
		var vertex=this._geometry.vertices[i];
		vertex.anchor=FSS.Vector3.clone(vertex.position);
		vertex.step=FSS.Vector3.create(
			Math.randomInRange(0.2, 1.0),
			Math.randomInRange(0.2, 1.0),
			Math.randomInRange(0.2, 1.0)
		);
		vertex.time=Math.randomInRange(0, Math.PIM2);
	}
}

MeshBackground.prototype._onTick=function()
{
	this._now = Date.now() - this._start;
	this._update();
	this._render();
}

MeshBackground.prototype._update=function()
{
	var ox, oy, oz, l, light, v, vertex, offset = this._settings.mesh.depth/2;
	// Update Bounds
	FSS.Vector3.copy(this._settings.light.bounds, this._center);
	FSS.Vector3.multiplyScalar(this._settings.light.bounds, this._settings.light.xyScalar);
	// Update Attractor
	FSS.Vector3.setZ(this._attractor, this._settings.light.zOffset);
	// Overwrite the Attractor position
	if (this._settings.light.autopilot)
	{
		ox=Math.sin(this._settings.light.step[0] * this._now * this._settings.light.speed);
		oy=Math.cos(this._settings.light.step[1] * this._now * this._settings.light.speed);
		FSS.Vector3.set(this._attractor,
			this._settings.light.bounds[0]*ox,
			this._settings.light.bounds[1]*oy,
			this._settings.light.zOffset);
	}
	// Animate Lights
	for(l=this._scene.lights.length - 1; l >= 0; l--)
	{
		light = this._scene.lights[l];

		// Reset the z position of the light
		FSS.Vector3.setZ(light.position, this._settings.light.zOffset);

		// Calculate the force Luke!
		var D=Math.clamp(FSS.Vector3.distanceSquared(light.position, this._attractor), this._settings.light.minDistance, this._settings.light.maxDistance);
		var F = this._settings.light.gravity * light.mass / D;
		FSS.Vector3.subtractVectors(light.force, this._attractor, light.position);
		FSS.Vector3.normalise(light.force);
		FSS.Vector3.multiplyScalar(light.force, F);

		// Update the light position
		FSS.Vector3.set(light.acceleration);
		FSS.Vector3.add(light.acceleration, light.force);
		FSS.Vector3.add(light.velocity, light.acceleration);
		FSS.Vector3.multiplyScalar(light.velocity, this._settings.light.dampening);
		FSS.Vector3.limit(light.velocity, this._settings.light.minLimit, this._settings.light.maxLimit);
		FSS.Vector3.add(light.position, light.velocity);
	}
	// Animate Vertices
	for (v = this._geometry.vertices.length - 1; v >= 0; v--)
	{
		vertex = this._geometry.vertices[v];
		ox = Math.sin(vertex.time + vertex.step[0] * this._now * this._settings.mesh.speed);
		oy = Math.cos(vertex.time + vertex.step[1] * this._now * this._settings.mesh.speed);
		oz = Math.sin(vertex.time + vertex.step[2] * this._now * this._settings.mesh.speed);
		FSS.Vector3.set(vertex.position,
			this._settings.mesh.xRange*this._geometry.segmentWidth*ox,
			this._settings.mesh.yRange*this._geometry.sliceHeight*oy,
			this._settings.mesh.zRange*offset*oz - offset);
			FSS.Vector3.add(vertex.position, vertex.anchor);
	}
	// Set the Geometry to dirty
	this._geometry.dirty = true;
}

MeshBackground.prototype._render=function()
{
	this._renderer.render(this._scene);
}

MeshBackground.prototype._onMouseMove=function(evt)
{
	FSS.Vector3.set(this._attractor, evt.clientX, this._renderer.height - evt.clientY);
	FSS.Vector3.subtract(this._attractor, this._center);
}

MeshBackground.prototype.deactivate=function()
{
	TweenLite.ticker.removeEventListener("tick",this._onTickHandler);
	document.removeEventListener('mousemove', this._onMouseMoveHandler)
}