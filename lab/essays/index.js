'use strict';

let citeNotes = {
  notes: [],
  tooltip: null,
  init: function() {
    document.querySelectorAll('#notes>li').forEach(note => {
      let regex = /<a href="#(.*?)".*?<\/a>(.*)/s;
      let matches = regex.exec(note.innerHTML);
      this.notes[matches[1]] = matches[2];
    });
    document.querySelectorAll('.page>p>sup').forEach(ref => {
      ref.addEventListener('mouseenter', this.enter.bind(this));
      ref.addEventListener('mouseleave', this.leave.bind(this));
    });
    this.tooltip = document.getElementById('tooltip');
  },
  enter: function(e) {
    let ref = e.target;
    this.tooltip.innerHTML = this.notes[ref.children[0].id];
    this.tooltip.style.left =
        (ref.offsetLeft + ref.getBoundingClientRect().width / 2) + 'px';
    this.tooltip.style.top = ref.offsetTop + 'px';
    this.tooltip.hidden = false;
  },
  leave: function(e) {
    this.tooltip.hidden = true;
  }
}

if (document.readyState == 'Loading')
window.addEventListener('DOMContentLoaded', citeNotes.init);
else citeNotes.init();