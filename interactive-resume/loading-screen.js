/**
 * Temporary shield protecting against FOUC
 */
var loading = {
  context: null,
  startPoint: null,
  interval: null,
  x: 0,
  y: 0,
  nodesX: 3.2,
  nodesY: 5.1,
  index: 0,
  count: 20,
  step: 2 * Math.PI / 200,
  /**
   * Initialize listeners
   */
  init: function() {
    window.addEventListener('load', loading.hide);
    loading.context =
        document.getElementById('loading-screen').children[0].getContext('2d');
    height = loading.context.canvas.clientHeight;
    width = loading.context.canvas.clientWidth;
    loading.startPoint = {x: width / 2, y: height / 2};
    loading.context.strokeStyle = '#33FF33';
    loading.context.fillStyle = '#282828';
    loading.context.fillRect(0, 0, width, height);
    loading.context.fillStyle = 'rgba(40, 40, 40, 0.07)';
    loading.interval = setInterval(loading.update, 10);
  },
  /**
   * Slide the screen up then stop rendering and delete it
   */
  hide: function() {
    document.getElementById('loading-screen').style.transform =
        'translateY(-100%)';
    setTimeout(function() {
      clearInterval(loading.interval);
      document.body.removeChild(document.getElementById('loading-screen'));
      document.getElementById('scroll-container').style.display = 'block';
      document.getElementById('brad').style.opacity = '1.0';
    }, 1000);
  },
  /**
   * Redraw the lissajous adding the next point. Painting a slightly opaque
   * color simulates persistance
   */
  update: function() {
    loading.context.beginPath();
    loading.context.moveTo(
        loading.startPoint.x + loading.x, loading.startPoint.y - loading.y);
    loading.index += loading.step;
    loading.x = height * Math.sin(loading.nodesX * loading.index) / 2;
    loading.y = width * Math.sin(loading.nodesY * loading.index) / 2;
    loading.context.lineTo(
        loading.startPoint.x + loading.x, loading.startPoint.y - loading.y);
    loading.count--;
    if (loading.count <= 0) {
      loading.count = 20;
      loading.context.fillRect(
          0, 0, loading.context.canvas.width, loading.context.canvas.height);
    }
    loading.context.stroke();
  }
};

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', loading.init);
else
  loading.init();