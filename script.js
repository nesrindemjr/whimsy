return '<a href="#/category/' + encodeURIComponent(c) + '" class="' + (active === c ? "on" : "") + '">' + c + '</a>';
  }).join("");
}
function reveal(){
  var els = document.querySelectorAll(".rv");
  if (!("IntersectionObserver" in window)) { els.forEach(function(e){e.classList.add("in")}); return; }
  var io = new IntersectionObserver(function(en){
    en.forEach(function(x){ if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
  }, {threshold: .1});
  els.forEach(function(e){io.observe(e)});
}

function route(){
  var raw = location.hash.replace(/^#\/?/, "");
  try { raw = decodeURIComponent(raw); } catch (e) {}
  var p = raw.split("/"), page = p[0], arg = p.slice(1).join("/");
  var html = "", active = "", title = BRAND;

  if (page === "story") {
    var a = ARTICLES.filter(function(x){return x.id === arg})[0];
    if (a) {
      active = a.cat; title = a.title + " | " + BRAND;
      var more = ARTICLES.filter(function(x){return x.cat === a.cat && x.id !== a.id});
      html = '<article class="article"><div class="head"><a class="back" href="#/">← Home</a><br><span class="tag">' + esc(a.cat) + '</span>' +
        '<h1>' + esc(a.title) + '</h1><div class="lead">' + esc(a.desc) + '</div><div class="date">' + esc(a.date) + '</div></div>' + ph(a) +
        '<div class="body">' + a.body.map(function(t){return '<p>' + esc(t) + '</p>'}).join("") + '</div></article>' +
        (more.length ? '<h2 class="sec" style="margin-top:50px">More in ' + esc(a.cat) + '</h2>' + list(more) : "");
    } else { html = '<p class="empty">Story not found.</p>'; }
  } else if (page === "category") {
    active = arg; title = arg + " | " + BRAND;
    html = '<h2 class="sec">' + esc(arg) + '</h2>' + list(ARTICLES.filter(function(x){return x.cat === arg}));
  } else if (page === "search") {
    var q = arg.toLowerCase();
    title = "Search | " + BRAND;
    html = '<h2 class="sec">Results for “' + esc(arg) + '”</h2>' + list(ARTICLES.filter(function(x){
      return (x.title + " " + x.desc + " " + x.cat + " " + x.body.join(" ")).toLowerCase().indexOf(q) > -1;
    }));
  } else {
    var f = ARTICLES[0];
    html = '<a class="hero rv" href="#/story/' + f.id + '">' + ph(f) + '<div class="txt"><span class="tag">' + esc(f.cat) + '</span><h1>' + esc(f.title) + '</h1><p>' + esc(f.desc) + '</p></div></a>' +
      '<div class="cols"><section><h2 class="sec">Latest</h2><div class="grid">' + ARTICLES.slice(1, 7).map(card).join("") + '</div></section>' +
      '<aside><h2 class="sec">Trending</h2><ol class="trend">' + ARTICLES.slice(1, 6).map(function(a, i){
        return '<li class="rv"><b>' + (i + 1) + '</b><a href="#/story/' + a.id + '"><span class="tag">' + esc(a.cat) + '</span><br>' + esc(a.title) + '</a></li>';
      }).join("") + '</ol></aside></div>';
  }

  $("app").innerHTML = html;
  $("nav").innerHTML = navHtml(active);
  document.title = title;
  window.scrollTo(0, 0);
  reveal();
}

$("logo").textContent = BRAND;
$("flogo").textContent = BRAND;
$("today").textContent = new Date().toLocaleDateString("en-GB", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
$("sf").onsubmit = function(e){
  e.preventDefault();
  var q = $("q").value.trim();
  if (q) location.hash = "#/search/" + encodeURIComponent(q);
};
window.addEventListener("hashchange", route);
route();
