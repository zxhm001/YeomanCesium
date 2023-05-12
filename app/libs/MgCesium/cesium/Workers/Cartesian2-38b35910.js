define(["exports","./Check-f996273c","./when-ae2e0b60","./Math-5bbcea10"],function(e,r,S,q){"use strict";function O(e,t,n){this.x=S.defaultValue(e,0),this.y=S.defaultValue(t,0),this.z=S.defaultValue(n,0)}O.fromSpherical=function(e,t){S.defined(t)||(t=new O);var n=e.clock,a=e.cone,e=S.defaultValue(e.magnitude,1),i=e*Math.sin(a);return t.x=i*Math.cos(n),t.y=i*Math.sin(n),t.z=e*Math.cos(a),t},O.fromElements=function(e,t,n,a){return S.defined(a)?(a.x=e,a.y=t,a.z=n,a):new O(e,t,n)},O.fromCartesian4=O.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.x=e.x,t.y=e.y,t.z=e.z,t):new O(e.x,e.y,e.z)},O.packedLength=3,O.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.x,t[n++]=e.y,t[n]=e.z,t},O.unpack=function(e,t,n){return t=S.defaultValue(t,0),(n=S.defined(n)?n:new O).x=e[t++],n.y=e[t++],n.z=e[t],n},O.packArray=function(e,t){var n=e.length,a=3*n;if(S.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new r.DeveloperError("If result is a typed array, it must have exactly array.length * 3 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var i=0;i<n;++i)O.pack(e[i],t,3*i);return t},O.unpackArray=function(e,t){var n=e.length;S.defined(t)?t.length=n/3:t=new Array(n/3);for(var a=0;a<n;a+=3){var i=a/3;t[i]=O.unpack(e,a,t[i])}return t},O.fromArray=O.unpack,O.maximumComponent=function(e){return Math.max(e.x,e.y,e.z)},O.minimumComponent=function(e){return Math.min(e.x,e.y,e.z)},O.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n.z=Math.min(e.z,t.z),n},O.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n.z=Math.max(e.z,t.z),n},O.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y+e.z*e.z},O.magnitude=function(e){return Math.sqrt(O.magnitudeSquared(e))};var n=new O,i=(O.distance=function(e,t){return O.subtract(e,t,n),O.magnitude(n)},O.distanceSquared=function(e,t){return O.subtract(e,t,n),O.magnitudeSquared(n)},O.normalize=function(e,t){var n=O.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t.z=e.z/n,t},O.dot=function(e,t){return e.x*t.x+e.y*t.y+e.z*t.z},O.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n.z=e.z*t.z,n},O.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n.z=e.z/t.z,n},O.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n.z=e.z+t.z,n},O.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n.z=e.z-t.z,n},O.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n.z=e.z*t,n},O.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n.z=e.z/t,n},O.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t.z=-e.z,t},O.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t.z=Math.abs(e.z),t},new O),a=(O.lerp=function(e,t,n,a){return O.multiplyByScalar(t,n,i),a=O.multiplyByScalar(e,1-n,a),O.add(i,a,a)},new O),u=new O,o=(O.angleBetween=function(e,t){O.normalize(e,a),O.normalize(t,u);e=O.dot(a,u),t=O.magnitude(O.cross(a,u,a));return Math.atan2(t,e)},new O),s=(O.mostOrthogonalAxis=function(e,t){e=O.normalize(e,o);return O.abs(e,e),t=e.x<=e.y?e.x<=e.z?O.clone(O.UNIT_X,t):O.clone(O.UNIT_Z,t):e.y<=e.z?O.clone(O.UNIT_Y,t):O.clone(O.UNIT_Z,t)},O.projectVector=function(e,t,n){e=O.dot(e,t)/O.dot(t,t);return O.multiplyByScalar(t,e,n)},O.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.x===t.x&&e.y===t.y&&e.z===t.z},O.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]&&e.z===t[n+2]},O.equalsEpsilon=function(e,t,n,a){return e===t||S.defined(e)&&S.defined(t)&&q.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&q.CesiumMath.equalsEpsilon(e.y,t.y,n,a)&&q.CesiumMath.equalsEpsilon(e.z,t.z,n,a)},O.cross=function(e,t,n){var a=e.x,i=e.y,e=e.z,r=t.x,u=t.y,t=t.z,o=e*r-a*t,a=a*u-i*r;return n.x=i*t-e*u,n.y=o,n.z=a,n},O.midpoint=function(e,t,n){return n.x=.5*(e.x+t.x),n.y=.5*(e.y+t.y),n.z=.5*(e.z+t.z),n},O.fromDegrees=function(e,t,n,a,i){return e=q.CesiumMath.toRadians(e),t=q.CesiumMath.toRadians(t),O.fromRadians(e,t,n,a,i)},new O),d=new O,h=new O(40680631590769,40680631590769,40408299984661.445),T=(O.fromRadians=function(e,t,n,a,i){n=S.defaultValue(n,0);var a=S.defined(a)?a.radiiSquared:h,r=Math.cos(t),r=(s.x=r*Math.cos(e),s.y=r*Math.sin(e),s.z=Math.sin(t),s=O.normalize(s,s),O.multiplyComponents(a,s,d),Math.sqrt(O.dot(s,d)));return d=O.divideByScalar(d,r,d),s=O.multiplyByScalar(s,n,s),S.defined(i)||(i=new O),O.add(d,s,i)},O.fromDegreesArray=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/2:n=new Array(a/2);for(var i=0;i<a;i+=2){var r=e[i],u=e[i+1],o=i/2;n[o]=O.fromDegrees(r,u,0,t,n[o])}return n},O.fromRadiansArray=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/2:n=new Array(a/2);for(var i=0;i<a;i+=2){var r=e[i],u=e[i+1],o=i/2;n[o]=O.fromRadians(r,u,0,t,n[o])}return n},O.fromDegreesArrayHeights=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/3:n=new Array(a/3);for(var i=0;i<a;i+=3){var r=e[i],u=e[i+1],o=e[i+2],s=i/3;n[s]=O.fromDegrees(r,u,o,t,n[s])}return n},O.fromRadiansArrayHeights=function(e,t,n){var a=e.length;S.defined(n)?n.length=a/3:n=new Array(a/3);for(var i=0;i<a;i+=3){var r=e[i],u=e[i+1],o=e[i+2],s=i/3;n[s]=O.fromRadians(r,u,o,t,n[s])}return n},O.ZERO=Object.freeze(new O(0,0,0)),O.UNIT_X=Object.freeze(new O(1,0,0)),O.UNIT_Y=Object.freeze(new O(0,1,0)),O.UNIT_Z=Object.freeze(new O(0,0,1)),O.prototype.clone=function(e){return O.clone(this,e)},O.prototype.equals=function(e){return O.equals(this,e)},O.prototype.equalsEpsilon=function(e,t,n){return O.equalsEpsilon(this,e,t,n)},O.prototype.toString=function(){return"("+this.x+", "+this.y+", "+this.z+")"},new O),A=new O;function l(e,t,n,a,i){var r=e.x,u=e.y,o=e.z,s=t.x,d=t.y,t=t.z,h=r*r*s*s,l=u*u*d*d,f=o*o*t*t,s=h+l+f,d=Math.sqrt(1/s),t=O.multiplyByScalar(e,d,T);if(s<a)return isFinite(d)?O.clone(t,i):void 0;var c=n.x,m=n.y,y=n.z,s=A,p=(s.x=t.x*c*2,s.y=t.y*m*2,s.z=t.z*y*2,(1-d)*O.magnitude(e)/(.5*O.magnitude(s))),g=0;do{var M,x,w,_,v,C,z,g=(z=h*(_=(M=1/(1+(p-=g)*c))*M)+l*(v=(x=1/(1+p*m))*x)+f*(C=(w=1/(1+p*y))*w)-1)/(-2*(h*(_*M)*c+l*(v*x)*m+f*(C*w)*y))}while(Math.abs(z)>q.CesiumMath.EPSILON12);return S.defined(i)?(i.x=r*M,i.y=u*x,i.z=o*w,i):new O(r*M,u*x,o*w)}function f(e,t,n){this.longitude=S.defaultValue(e,0),this.latitude=S.defaultValue(t,0),this.height=S.defaultValue(n,0)}f.fromRadians=function(e,t,n,a){return n=S.defaultValue(n,0),S.defined(a)?(a.longitude=e,a.latitude=t,a.height=n,a):new f(e,t,n)},f.fromDegrees=function(e,t,n,a){return e=q.CesiumMath.toRadians(e),t=q.CesiumMath.toRadians(t),f.fromRadians(e,t,n,a)};var c=new O,m=new O,y=new O,p=new O(1/6378137,1/6378137,1/6356752.314245179),g=new O(1/40680631590769,1/40680631590769,1/40408299984661.445),M=q.CesiumMath.EPSILON1;function x(e,t,n,a){t=S.defaultValue(t,0),n=S.defaultValue(n,0),a=S.defaultValue(a,0),e._radii=new O(t,n,a),e._radiiSquared=new O(t*t,n*n,a*a),e._radiiToTheFourth=new O(t*t*t*t,n*n*n*n,a*a*a*a),e._oneOverRadii=new O(0===t?0:1/t,0===n?0:1/n,0===a?0:1/a),e._oneOverRadiiSquared=new O(0===t?0:1/(t*t),0===n?0:1/(n*n),0===a?0:1/(a*a)),e._minimumRadius=Math.min(t,n,a),e._maximumRadius=Math.max(t,n,a),e._centerToleranceSquared=q.CesiumMath.EPSILON1,0!==e._radiiSquared.z&&(e._squaredXOverSquaredZ=e._radiiSquared.x/e._radiiSquared.z)}function w(e,t,n){this._radii=void 0,this._radiiSquared=void 0,this._radiiToTheFourth=void 0,this._oneOverRadii=void 0,this._oneOverRadiiSquared=void 0,this._minimumRadius=void 0,this._maximumRadius=void 0,this._centerToleranceSquared=void 0,this._squaredXOverSquaredZ=void 0,x(this,e,t,n)}f.fromCartesian=function(e,t,n){var a=S.defined(t)?t.oneOverRadii:p,i=S.defined(t)?t.oneOverRadiiSquared:g,a=l(e,a,i,S.defined(t)?t._centerToleranceSquared:M,m);if(S.defined(a))return t=O.multiplyComponents(a,i,c),t=O.normalize(t,t),i=O.subtract(e,a,y),a=Math.atan2(t.y,t.x),t=Math.asin(t.z),e=q.CesiumMath.sign(O.dot(i,e))*O.magnitude(i),S.defined(n)?(n.longitude=a,n.latitude=t,n.height=e,n):new f(a,t,e)},f.toCartesian=function(e,t,n){return O.fromRadians(e.longitude,e.latitude,e.height,t,n)},f.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.longitude=e.longitude,t.latitude=e.latitude,t.height=e.height,t):new f(e.longitude,e.latitude,e.height)},f.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.longitude===t.longitude&&e.latitude===t.latitude&&e.height===t.height},f.equalsEpsilon=function(e,t,n){return n=S.defaultValue(n,0),e===t||S.defined(e)&&S.defined(t)&&Math.abs(e.longitude-t.longitude)<=n&&Math.abs(e.latitude-t.latitude)<=n&&Math.abs(e.height-t.height)<=n},f.ZERO=Object.freeze(new f(0,0,0)),f.prototype.clone=function(e){return f.clone(this,e)},f.prototype.equals=function(e){return f.equals(this,e)},f.prototype.equalsEpsilon=function(e,t){return f.equalsEpsilon(this,e,t)},f.prototype.toString=function(){return"("+this.longitude+", "+this.latitude+", "+this.height+")"},Object.defineProperties(w.prototype,{radii:{get:function(){return this._radii}},radiiSquared:{get:function(){return this._radiiSquared}},radiiToTheFourth:{get:function(){return this._radiiToTheFourth}},oneOverRadii:{get:function(){return this._oneOverRadii}},oneOverRadiiSquared:{get:function(){return this._oneOverRadiiSquared}},minimumRadius:{get:function(){return this._minimumRadius}},maximumRadius:{get:function(){return this._maximumRadius}}}),w.clone=function(e,t){var n;if(S.defined(e))return n=e._radii,S.defined(t)?(O.clone(n,t._radii),O.clone(e._radiiSquared,t._radiiSquared),O.clone(e._radiiToTheFourth,t._radiiToTheFourth),O.clone(e._oneOverRadii,t._oneOverRadii),O.clone(e._oneOverRadiiSquared,t._oneOverRadiiSquared),t._minimumRadius=e._minimumRadius,t._maximumRadius=e._maximumRadius,t._centerToleranceSquared=e._centerToleranceSquared,t):new w(n.x,n.y,n.z)},w.fromCartesian3=function(e,t){return S.defined(t)||(t=new w),S.defined(e)&&x(t,e.x,e.y,e.z),t},w.WGS84=Object.freeze(new w(6378137,6378137,6356752.314245179)),w.UNIT_SPHERE=Object.freeze(new w(1,1,1)),w.MOON=Object.freeze(new w(q.CesiumMath.LUNAR_RADIUS,q.CesiumMath.LUNAR_RADIUS,q.CesiumMath.LUNAR_RADIUS)),w.prototype.clone=function(e){return w.clone(this,e)},w.packedLength=O.packedLength,w.pack=function(e,t,n){return n=S.defaultValue(n,0),O.pack(e._radii,t,n),t},w.unpack=function(e,t,n){t=S.defaultValue(t,0);e=O.unpack(e,t);return w.fromCartesian3(e,n)},w.prototype.geocentricSurfaceNormal=O.normalize,w.prototype.geodeticSurfaceNormalCartographic=function(e,t){var n=e.longitude,e=e.latitude,a=Math.cos(e),i=a*Math.cos(n),a=a*Math.sin(n),n=Math.sin(e);return(t=S.defined(t)?t:new O).x=i,t.y=a,t.z=n,O.normalize(t,t)},w.prototype.geodeticSurfaceNormal=function(e,t){if(!O.equalsEpsilon(e,O.ZERO,q.CesiumMath.EPSILON14))return S.defined(t)||(t=new O),t=O.multiplyComponents(e,this._oneOverRadiiSquared,t),O.normalize(t,t)};var _=new O,v=new O,C=(w.prototype.cartographicToCartesian=function(e,t){var n=_,a=v,i=(this.geodeticSurfaceNormalCartographic(e,n),O.multiplyComponents(this._radiiSquared,n,a),Math.sqrt(O.dot(n,a)));return O.divideByScalar(a,i,a),O.multiplyByScalar(n,e.height,n),S.defined(t)||(t=new O),O.add(a,n,t)},w.prototype.cartographicArrayToCartesianArray=function(e,t){var n=e.length;S.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;a++)t[a]=this.cartographicToCartesian(e[a],t[a]);return t},new O),z=new O,U=new O,L=(w.prototype.cartesianToCartographic=function(e,t){var n,a,i=this.scaleToGeodeticSurface(e,z);if(S.defined(i))return a=this.geodeticSurfaceNormal(i,C),i=O.subtract(e,i,U),n=Math.atan2(a.y,a.x),a=Math.asin(a.z),e=q.CesiumMath.sign(O.dot(i,e))*O.magnitude(i),S.defined(t)?(t.longitude=n,t.latitude=a,t.height=e,t):new f(n,a,e)},w.prototype.cartesianArrayToCartographicArray=function(e,t){var n=e.length;S.defined(t)?t.length=n:t=new Array(n);for(var a=0;a<n;++a)t[a]=this.cartesianToCartographic(e[a],t[a]);return t},w.prototype.scaleToGeodeticSurface=function(e,t){return l(e,this._oneOverRadii,this._oneOverRadiiSquared,this._centerToleranceSquared,t)},w.prototype.scaleToGeocentricSurface=function(e,t){S.defined(t)||(t=new O);var n=e.x,a=e.y,i=e.z,r=this._oneOverRadiiSquared,n=1/Math.sqrt(n*n*r.x+a*a*r.y+i*i*r.z);return O.multiplyByScalar(e,n,t)},w.prototype.transformPositionToScaledSpace=function(e,t){return S.defined(t)||(t=new O),O.multiplyComponents(e,this._oneOverRadii,t)},w.prototype.transformPositionFromScaledSpace=function(e,t){return S.defined(t)||(t=new O),O.multiplyComponents(e,this._radii,t)},w.prototype.equals=function(e){return this===e||S.defined(e)&&O.equals(this._radii,e._radii)},w.prototype.toString=function(){return this._radii.toString()},w.prototype.getSurfaceNormalIntersectionWithZAxis=function(e,t,n){t=S.defaultValue(t,0);var a=this._squaredXOverSquaredZ;if((n=S.defined(n)?n:new O).x=0,n.y=0,n.z=e.z*(1-a),!(Math.abs(n.z)>=this._radii.z-t))return n},[.14887433898163,.43339539412925,.67940956829902,.86506336668898,.97390652851717,0]),W=[.29552422471475,.26926671930999,.21908636251598,.14945134915058,.066671344308684,0];function R(e,t,n){for(var a=.5*(t+e),i=.5*(t-e),r=0,u=0;u<5;u++){var o=i*L[u];r+=W[u]*(n(a+o)+n(a-o))}return r*=i}function V(e,t,n,a){this.west=S.defaultValue(e,0),this.south=S.defaultValue(t,0),this.east=S.defaultValue(n,0),this.north=S.defaultValue(a,0)}w.prototype.surfaceArea=function(e){for(var t=e.west,i=e.east,n=e.south,e=e.north;i<t;)i+=q.CesiumMath.TWO_PI;var a=this._radiiSquared,r=a.x,u=a.y,o=a.z,s=r*u;return R(n,e,function(e){var n=Math.cos(e),a=Math.sin(e);return Math.cos(e)*R(t,i,function(e){var t=Math.cos(e),e=Math.sin(e);return Math.sqrt(s*a*a+o*(u*t*t+r*e*e)*n*n)})})},Object.defineProperties(V.prototype,{width:{get:function(){return V.computeWidth(this)}},height:{get:function(){return V.computeHeight(this)}}}),V.packedLength=4,V.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.west,t[n++]=e.south,t[n++]=e.east,t[n]=e.north,t},V.unpack=function(e,t,n){return t=S.defaultValue(t,0),(n=S.defined(n)?n:new V).west=e[t++],n.south=e[t++],n.east=e[t++],n.north=e[t],n},V.computeWidth=function(e){var t=e.east,e=e.west;return t<e&&(t+=q.CesiumMath.TWO_PI),t-e},V.computeHeight=function(e){return e.north-e.south},V.fromDegrees=function(e,t,n,a,i){return e=q.CesiumMath.toRadians(S.defaultValue(e,0)),t=q.CesiumMath.toRadians(S.defaultValue(t,0)),n=q.CesiumMath.toRadians(S.defaultValue(n,0)),a=q.CesiumMath.toRadians(S.defaultValue(a,0)),S.defined(i)?(i.west=e,i.south=t,i.east=n,i.north=a,i):new V(e,t,n,a)},V.fromRadians=function(e,t,n,a,i){return S.defined(i)?(i.west=S.defaultValue(e,0),i.south=S.defaultValue(t,0),i.east=S.defaultValue(n,0),i.north=S.defaultValue(a,0),i):new V(e,t,n,a)},V.fromCartographicArray=function(e,t){for(var n=Number.MAX_VALUE,a=-Number.MAX_VALUE,i=Number.MAX_VALUE,r=-Number.MAX_VALUE,u=Number.MAX_VALUE,o=-Number.MAX_VALUE,s=0,d=e.length;s<d;s++)var h=e[s],n=Math.min(n,h.longitude),a=Math.max(a,h.longitude),u=Math.min(u,h.latitude),o=Math.max(o,h.latitude),h=0<=h.longitude?h.longitude:h.longitude+q.CesiumMath.TWO_PI,i=Math.min(i,h),r=Math.max(r,h);return r-i<a-n&&(n=i,(a=r)>q.CesiumMath.PI&&(a-=q.CesiumMath.TWO_PI),n>q.CesiumMath.PI)&&(n-=q.CesiumMath.TWO_PI),S.defined(t)?(t.west=n,t.south=u,t.east=a,t.north=o,t):new V(n,u,a,o)},V.fromCartesianArray=function(e,t,n){t=S.defaultValue(t,w.WGS84);for(var a=Number.MAX_VALUE,i=-Number.MAX_VALUE,r=Number.MAX_VALUE,u=-Number.MAX_VALUE,o=Number.MAX_VALUE,s=-Number.MAX_VALUE,d=0,h=e.length;d<h;d++)var l=t.cartesianToCartographic(e[d]),a=Math.min(a,l.longitude),i=Math.max(i,l.longitude),o=Math.min(o,l.latitude),s=Math.max(s,l.latitude),l=0<=l.longitude?l.longitude:l.longitude+q.CesiumMath.TWO_PI,r=Math.min(r,l),u=Math.max(u,l);return u-r<i-a&&(a=r,(i=u)>q.CesiumMath.PI&&(i-=q.CesiumMath.TWO_PI),a>q.CesiumMath.PI)&&(a-=q.CesiumMath.TWO_PI),S.defined(n)?(n.west=a,n.south=o,n.east=i,n.north=s,n):new V(a,o,i,s)},V.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.west=e.west,t.south=e.south,t.east=e.east,t.north=e.north,t):new V(e.west,e.south,e.east,e.north)},V.equalsEpsilon=function(e,t,n){return n=S.defaultValue(n,0),e===t||S.defined(e)&&S.defined(t)&&Math.abs(e.west-t.west)<=n&&Math.abs(e.south-t.south)<=n&&Math.abs(e.east-t.east)<=n&&Math.abs(e.north-t.north)<=n},V.prototype.clone=function(e){return V.clone(this,e)},V.prototype.equals=function(e){return V.equals(this,e)},V.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.west===t.west&&e.south===t.south&&e.east===t.east&&e.north===t.north},V.prototype.equalsEpsilon=function(e,t){return V.equalsEpsilon(this,e,t)},V.validate=function(e){},V.southwest=function(e,t){return S.defined(t)?(t.longitude=e.west,t.latitude=e.south,t.height=0,t):new f(e.west,e.south)},V.northwest=function(e,t){return S.defined(t)?(t.longitude=e.west,t.latitude=e.north,t.height=0,t):new f(e.west,e.north)},V.northeast=function(e,t){return S.defined(t)?(t.longitude=e.east,t.latitude=e.north,t.height=0,t):new f(e.east,e.north)},V.southeast=function(e,t){return S.defined(t)?(t.longitude=e.east,t.latitude=e.south,t.height=0,t):new f(e.east,e.south)},V.center=function(e,t){var n=e.east,a=e.west,a=(n<a&&(n+=q.CesiumMath.TWO_PI),q.CesiumMath.negativePiToPi(.5*(a+n))),n=.5*(e.south+e.north);return S.defined(t)?(t.longitude=a,t.latitude=n,t.height=0,t):new f(a,n)},V.intersection=function(e,t,n){var a=e.east,i=e.west,r=t.east,u=t.west,i=(a<i&&0<r?a+=q.CesiumMath.TWO_PI:r<u&&0<a&&(r+=q.CesiumMath.TWO_PI),a<i&&u<0?u+=q.CesiumMath.TWO_PI:r<u&&i<0&&(i+=q.CesiumMath.TWO_PI),q.CesiumMath.negativePiToPi(Math.max(i,u))),u=q.CesiumMath.negativePiToPi(Math.min(a,r));if(!((e.west<e.east||t.west<t.east)&&u<=i)){a=Math.max(e.south,t.south),r=Math.min(e.north,t.north);if(!(r<=a))return S.defined(n)?(n.west=i,n.south=a,n.east=u,n.north=r,n):new V(i,a,u,r)}},V.simpleIntersection=function(e,t,n){var a=Math.max(e.west,t.west),i=Math.max(e.south,t.south),r=Math.min(e.east,t.east),e=Math.min(e.north,t.north);if(!(e<=i||r<=a))return S.defined(n)?(n.west=a,n.south=i,n.east=r,n.north=e,n):new V(a,i,r,e)},V.union=function(e,t,n){S.defined(n)||(n=new V);var a=e.east,i=e.west,r=t.east,u=t.west,i=(a<i&&0<r?a+=q.CesiumMath.TWO_PI:r<u&&0<a&&(r+=q.CesiumMath.TWO_PI),a<i&&u<0?u+=q.CesiumMath.TWO_PI:r<u&&i<0&&(i+=q.CesiumMath.TWO_PI),q.CesiumMath.convertLongitudeRange(Math.min(i,u))),u=q.CesiumMath.convertLongitudeRange(Math.max(a,r));return n.west=i,n.south=Math.min(e.south,t.south),n.east=u,n.north=Math.max(e.north,t.north),n},V.expand=function(e,t,n){return(n=S.defined(n)?n:new V).west=Math.min(e.west,t.longitude),n.south=Math.min(e.south,t.latitude),n.east=Math.max(e.east,t.longitude),n.north=Math.max(e.north,t.latitude),n},V.contains=function(e,t){var n=t.longitude,t=t.latitude,a=e.west,i=e.east;return i<a&&(i+=q.CesiumMath.TWO_PI,n<0)&&(n+=q.CesiumMath.TWO_PI),(a<n||q.CesiumMath.equalsEpsilon(n,a,q.CesiumMath.EPSILON14))&&(n<i||q.CesiumMath.equalsEpsilon(n,i,q.CesiumMath.EPSILON14))&&t>=e.south&&t<=e.north};var k=new f;function b(e,t){this.x=S.defaultValue(e,0),this.y=S.defaultValue(t,0)}V.subsample=function(e,t,n,a){t=S.defaultValue(t,w.WGS84),n=S.defaultValue(n,0),S.defined(a)||(a=[]);var i=0,r=e.north,u=e.south,o=e.east,s=e.west,d=k;d.height=n,d.longitude=s,d.latitude=r,a[i]=t.cartographicToCartesian(d,a[i]),i++,d.longitude=o,a[i]=t.cartographicToCartesian(d,a[i]),i++,d.latitude=u,a[i]=t.cartographicToCartesian(d,a[i]),i++,d.longitude=s,a[i]=t.cartographicToCartesian(d,a[i]),i++,d.latitude=r<0?r:0<u?u:0;for(var h=1;h<8;++h)d.longitude=-Math.PI+h*q.CesiumMath.PI_OVER_TWO,V.contains(e,d)&&(a[i]=t.cartographicToCartesian(d,a[i]),i++);return 0===d.latitude&&(d.longitude=s,a[i]=t.cartographicToCartesian(d,a[i]),i++,d.longitude=o,a[i]=t.cartographicToCartesian(d,a[i]),i++),a.length=i,a},V.MAX_VALUE=Object.freeze(new V(-Math.PI,-q.CesiumMath.PI_OVER_TWO,Math.PI,q.CesiumMath.PI_OVER_TWO)),b.fromElements=function(e,t,n){return S.defined(n)?(n.x=e,n.y=t,n):new b(e,t)},b.fromCartesian3=b.clone=function(e,t){if(S.defined(e))return S.defined(t)?(t.x=e.x,t.y=e.y,t):new b(e.x,e.y)},b.fromCartesian4=b.clone,b.packedLength=2,b.pack=function(e,t,n){return n=S.defaultValue(n,0),t[n++]=e.x,t[n]=e.y,t},b.unpack=function(e,t,n){return t=S.defaultValue(t,0),(n=S.defined(n)?n:new b).x=e[t++],n.y=e[t],n},b.packArray=function(e,t){var n=e.length,a=2*n;if(S.defined(t)){if(!Array.isArray(t)&&t.length!==a)throw new r.DeveloperError("If result is a typed array, it must have exactly array.length * 2 elements");t.length!==a&&(t.length=a)}else t=new Array(a);for(var i=0;i<n;++i)b.pack(e[i],t,2*i);return t},b.unpackArray=function(e,t){var n=e.length;S.defined(t)?t.length=n/2:t=new Array(n/2);for(var a=0;a<n;a+=2){var i=a/2;t[i]=b.unpack(e,a,t[i])}return t},b.fromArray=b.unpack,b.maximumComponent=function(e){return Math.max(e.x,e.y)},b.minimumComponent=function(e){return Math.min(e.x,e.y)},b.minimumByComponent=function(e,t,n){return n.x=Math.min(e.x,t.x),n.y=Math.min(e.y,t.y),n},b.maximumByComponent=function(e,t,n){return n.x=Math.max(e.x,t.x),n.y=Math.max(e.y,t.y),n},b.magnitudeSquared=function(e){return e.x*e.x+e.y*e.y},b.magnitude=function(e){return Math.sqrt(b.magnitudeSquared(e))};var I=new b,E=(b.distance=function(e,t){return b.subtract(e,t,I),b.magnitude(I)},b.distanceSquared=function(e,t){return b.subtract(e,t,I),b.magnitudeSquared(I)},b.normalize=function(e,t){var n=b.magnitude(e);return t.x=e.x/n,t.y=e.y/n,t},b.dot=function(e,t){return e.x*t.x+e.y*t.y},b.cross=function(e,t){return e.x*t.y-e.y*t.x},b.multiplyComponents=function(e,t,n){return n.x=e.x*t.x,n.y=e.y*t.y,n},b.divideComponents=function(e,t,n){return n.x=e.x/t.x,n.y=e.y/t.y,n},b.add=function(e,t,n){return n.x=e.x+t.x,n.y=e.y+t.y,n},b.subtract=function(e,t,n){return n.x=e.x-t.x,n.y=e.y-t.y,n},b.multiplyByScalar=function(e,t,n){return n.x=e.x*t,n.y=e.y*t,n},b.divideByScalar=function(e,t,n){return n.x=e.x/t,n.y=e.y/t,n},b.negate=function(e,t){return t.x=-e.x,t.y=-e.y,t},b.abs=function(e,t){return t.x=Math.abs(e.x),t.y=Math.abs(e.y),t},new b),P=(b.lerp=function(e,t,n,a){return b.multiplyByScalar(t,n,E),a=b.multiplyByScalar(e,1-n,a),b.add(E,a,a)},new b),N=new b,B=(b.angleBetween=function(e,t){return b.normalize(e,P),b.normalize(t,N),q.CesiumMath.acosClamped(b.dot(P,N))},new b);b.mostOrthogonalAxis=function(e,t){e=b.normalize(e,B);return b.abs(e,e),t=e.x<=e.y?b.clone(b.UNIT_X,t):b.clone(b.UNIT_Y,t)},b.equals=function(e,t){return e===t||S.defined(e)&&S.defined(t)&&e.x===t.x&&e.y===t.y},b.equalsArray=function(e,t,n){return e.x===t[n]&&e.y===t[n+1]},b.equalsEpsilon=function(e,t,n,a){return e===t||S.defined(e)&&S.defined(t)&&q.CesiumMath.equalsEpsilon(e.x,t.x,n,a)&&q.CesiumMath.equalsEpsilon(e.y,t.y,n,a)},b.ZERO=Object.freeze(new b(0,0)),b.UNIT_X=Object.freeze(new b(1,0)),b.UNIT_Y=Object.freeze(new b(0,1)),b.prototype.clone=function(e){return b.clone(this,e)},b.prototype.equals=function(e){return b.equals(this,e)},b.prototype.equalsEpsilon=function(e,t,n){return b.equalsEpsilon(this,e,t,n)},b.prototype.toString=function(){return"("+this.x+", "+this.y+")"},e.Cartesian2=b,e.Cartesian3=O,e.Cartographic=f,e.Ellipsoid=w,e.Rectangle=V});