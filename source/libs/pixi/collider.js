function Collider(tag, whitelist, shape) {
	this.colliderTag = tag;
	this.colliderWhitelist = whitelist;
	this.colliderShape = shape;
}

function Trigger(tag, whitelist, shape) {
	this.triggerTag = tag;
	this.triggerWhitelist = whitelist;
	this.triggerShape = shape;
}

var Tags = {
	Player : 'player',
	PlayerBullet : 'player bullet',
	Ennemy : 'ennemy',
	EnnemyBullet : 'ennemy bullet',
	Seamark : 'seamark',
	SightArea : 'sight area',
	Radar : 'radar'
}