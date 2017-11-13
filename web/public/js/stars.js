(function(){

var Star = function(space) {
  this.space = space;

  this.speed = 0.1;
  this.velocity = 0.5;

  this.size = 0.1;
  this.growth = 1;

  this.vec= [sign()*Math.random(),sign()*Math.random()]

  this.x = Math.floor(space.c_width/2)+this.vec[0]*40;
  this.y = Math.floor(space.c_height/2)+this.vec[1]*40;
}

Star.prototype.update = function() {
  this.x += this.speed*this.vec[0];
  this.y += this.speed*this.vec[1];

  this.speed += this.velocity;
  this.size += this.growth;

  if(Math.abs(this.x) > this.space.c_width + 100 || Math.abs(this.y) > this.space.c_height + 100) {
  	this.space.population.splice(this.space.population.indexOf(this),1)
  	this.space.populate(1);
  }

};

function sign() {
  return Math.random() > 0.5 ? 1 : -1
}


var Space = function(n) {
		this.canvas = document.createElement("canvas");
		this.canvas.id = 'hyperloop';
		this.ctx = this.canvas.getContext('2d');

		this.c_width = window.innerWidth;
		this.c_height = window.innerHeight;
		this.canvas.width = this.c_width; 
		this.canvas.height = this.c_height; 	

		this.ctx.fillStyle = "#ffffff";
		this.ctx.strokeStyle = "#ffffff";

		document.body.appendChild(this.canvas);

		this.population = [];
		this.populate(n);

		setInterval(this.update.bind(this), 10);
}

Space.prototype = {
	constructor: Space,
	populate: function(n) {
		for (var i=0; i<n; i++) {
			this.population.push(new Star(this));
		};
	},
	update: function() {
		this.population.forEach(function(star, i){ 
			star.update();
		})

		this.redraw();
	},
	redraw: function(){
		var ctx = this.ctx,
			cw2 = Math.floor(this.c_width/2),
			ch2 = Math.floor(this.c_width/2);

		ctx.save();
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0,0,this.c_width,this.c_height);

		this.population.forEach(function(star, i){
		        ctx.beginPath();
		        ctx.moveTo(star.x, star.y);
		        ctx.lineTo(star.x-star.vec[0]*star.size, star.y-star.vec[1]*star.size);
		        ctx.stroke();
		})

	    ctx.restore();

	}
}


document.addEventListener('DOMContentLoaded', function() {
	var sp = new Space(5);
	console.log(sp);
});

})();
