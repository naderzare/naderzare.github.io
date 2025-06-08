document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('timeline');
  if (!el) return;
  var dataPath = el.getAttribute('data-src') || 'assets/data/timeline.json';
  fetch(dataPath)
    .then(function(resp){ return resp.json(); })
    .then(renderTimeline);

  function parseDate(s){
    var p = s.split('-');
    return new Date(parseInt(p[0],10), parseInt(p[1],10)-1, 1);
  }

  function monthsBetween(d1,d2){
    return (d2.getFullYear()-d1.getFullYear())*12 + (d2.getMonth()-d1.getMonth());
  }

  function renderTimeline(data){
    var dates = data.bands.map(function(b){return [parseDate(b.start), parseDate(b.end)];}).flat();
    data.milestones.forEach(function(m){dates.push(parseDate(m.date));});
    data.callouts.forEach(function(c){dates.push(parseDate(c.date));});
    var min = new Date(Math.min.apply(null, dates));
    var max = new Date(Math.max.apply(null, dates));
    var unit = 8; // px per month

    for(var y=min.getFullYear(); y<=max.getFullYear(); y++){
      var lab = document.createElement('div');
      lab.className = 'year-label';
      lab.style.top = monthsBetween(min, new Date(y,0,1))*unit + 'px';
      lab.textContent = y;
      el.appendChild(lab);
    }

    data.bands.forEach(function(b){
      var start = parseDate(b.start); var end = parseDate(b.end);
      var div = document.createElement('div');
      div.className = 'timeline-band '+b.category;
      div.style.top = monthsBetween(min,start)*unit + 'px';
      div.style.height = monthsBetween(start,end)*unit + 'px';
      div.innerHTML = '<span class="band-title">'+b.title+'</span>';
      if(b.tags){
        var tagWrap = document.createElement('div');
        tagWrap.className = 'timeline-tags';
        b.tags.forEach(function(t){
          var s = document.createElement('span');
          s.className = 'timeline-skill';
          s.textContent = t;
          tagWrap.appendChild(s);
        });
        div.appendChild(tagWrap);
      }
      el.appendChild(div);
    });

    data.milestones.forEach(function(m){
      var d = parseDate(m.date);
      var node = document.createElement('div');
      node.className = 'timeline-node';
      node.title = m.label;
      node.style.top = monthsBetween(min,d)*unit + 'px';
      el.appendChild(node);
    });

    data.callouts.forEach(function(c){
      var d = parseDate(c.date);
      var card = document.createElement('div');
      card.className = 'timeline-callout';
      card.style.top = monthsBetween(min,d)*unit + 'px';
      card.innerHTML = c.title.replace(/\n/g,'<br>');
      el.appendChild(card);
    });
  }
});
