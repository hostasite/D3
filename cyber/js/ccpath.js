function ready(e, t, s, a) {
    pathwayW = parseInt(d3.select(".container").style("width")),
    graph = {
        nodes: [],
        links: []
    },
    t.forEach(function(e) {
        graph.nodes.push({
            id: e.source_id,
            name: e.source,
            level: e.level
        }),
        graph.links.push({
            source: e.source,
            source_id: e.source_id,
            target: e.target,
            target_id: e.target_id,
            value: e.value
        })
    });
    var l = d3.nest().key(function(e) {
        return e.name
    })
      , r = l.entries(graph.nodes);
    graph.nodes = r.map(function(e) {
        return e.values[0]
    }),
    graph.links.forEach(function(e, t) {
        graph.links[t].source = graph.nodes.map(function(e, s) {
            return e.name == graph.links[t].source ? s : void 0
        }).filter(isFinite)[0],
        graph.links[t].target = graph.nodes.map(function(e, s) {
            return e.name == graph.links[t].target ? s : void 0
        }).filter(isFinite)[0]
    }),
    graph.nodes.forEach(function(e, t) {
        graph.nodes[t] = {
            id: e.id,
            name: e.name,
            level: e.level
        }
    });
    for (var n, o = 0; o < levels.length; o++) {
        n = graph.nodes.filter(function(e) {
            return e.level == levels[o]
        });
        for (var i = 0; i < n.length; i++)
            n[i].levelIndex = i,
            n[i].levelLength = n.length
    }
    jobsDataset = d3.nest().key(function(e) {
        return e.id
    }).entries(s),
    catsData = d3.nest().key(function(e) {
        return e.id
    }).key(function(e) {
        return e.nice_areas
    }).key(function(e) {
        return e.nice_subcategories
    }).entries(a),
    draw(),
    drawCircleChart("average_salary", ".no1"),
    drawCircleChart("job_openings", "#no2"),
    drawStackedBar(),
    fillList("commonJobsList", "e1", "common_job_titles"),
    fillList("topCertificationsList", "e1", "top_certifications"),
    fillList("topSkillsList", "e1", "top_skills"),
    d3.selectAll(".educationChart").style("display", "inherit"),
    updateStackedBar("e1"),
    fillAreas("e1"),
    new ShareButton({
        networks: {
            email: {
                enabled: !1
            }
        }
    }),
    setBoxHeight();
    var c = document.getElementById("r1")
      , d = document.getElementById("c2")
      , p = document.getElementById("c4")
      , y = document.getElementById("c3");
    1e3 > pathwayW && pathwayW > 575 ? c.insertBefore(p, d) : 575 >= pathwayW && (c.insertBefore(p, d),
    c.insertBefore(y, d)),
    d3.select(window).on("resize", function() {
        pathwayW = parseInt(d3.select(".container").style("width")),
        1e3 > pathwayW && c.insertBefore(p, d)
    }),
    $(".table").css("display", "none"),
    d3.selectAll(".infIcon").on("click", function() {
        d3.select("#b" + d3.select(this).attr("rel")).style("display", "inherit")
    }),
    d3.selectAll(".closeBtn").on("click", function() {
        d3.select("#b" + d3.select(this).attr("rel")).style("display", "none")
    })
}
function draw() {
    nodes = graph.nodes,
    links = graph.links;
    var e, t, s, a = (d3.select(".pathway").append("div").attr("class", "tooltip"),
    d3.select(".pathway").node().getBoundingClientRect()), l = {
        top: 60,
        right: .1 * a.width,
        bottom: 15,
        left: .1 * a.width
    };
    pathwayW > 550 ? l.top = l.top : l.top = 20,
    pathwayW > 550 ? l.left = l.left : l.left = 0,
    pathwayW > 550 ? l.right = l.right : l.right = 50,
    s = pathwayW > 685 ? 47 : 15,
    e = a.width - l.left - l.right,
    t = pathwayW > 550 ? .75 * a.width - l.top - l.bottom : 1.1 * a.width - l.top - l.bottom;
    for (var r = d3.scale.ordinal().domain(levels).rangeRoundPoints([40, e]), n = (d3.scale.sqrt().domain(d3.extent(jobsDataset.map(function(e) {
        return +e.values[0].job_openings
    }))).range([t / 10, t / 7]),
    0); n < nodes.length; n++)
        nodes[n].fixed = !0,
        nodes[n].x = r(nodes[n].level),
        nodes[n].y = nodes[n].levelIndex * (t / nodes[n].levelLength) + t / 2 / nodes[n].levelLength;
    var o = d3.svg.diagonal().projection(function(e) {
        return [e.y, e.x]
    })
      , i = d3.select(".pathway").append("svg").attr("width", e + l.left + l.right).attr("height", t + l.top + l.bottom);
    i.append("rect").attr("width", e + l.left + l.right).attr("height", t + l.top + l.bottom).attr("class", "backGrndClick").style("z-index", -100).style("fill", "#fff").on("click", unclick),
    i.append("rect").attr("width", function() {
        return pathwayW > 550 ? 150 : 80
    }).attr("height", function() {
        return pathwayW > 550 ? t + 30 : t + 15
    }).attr("y", function() {
        return pathwayW > 550 ? 40 : 20
    }).attr("x", function() {
        return pathwayW > 550 ? 43 : 0
    }).attr("class", "backgr").attr("rx", 6).attr("ry", 6).style("z-index", -100).style("fill", "#fff").style("stroke", "#CFD8DC");
    var c = i.append("g").attr("transform", "translate(" + l.left + "," + l.top + ")").selectAll(".levLines").data(levels)
      , d = c.enter().append("g");
    d.append("line").attr("x1", function(e) {
        return r(e)
    }).attr("y1", 0).attr("x2", function(e) {
        return r(e)
    }).attr("y2", t).style("stroke", "#eaeaea"),
    d.append("text").attr("class", "levLab").attr("x", function(e) {
        return r(e)
    }).attr("y", -5).attr("text-anchor", "middle").text(function(e) {
        return "Feeder" !== e ? e : "Feeder Role"
    }),
    i.append("defs").append("marker").attr("id", "marker").attr("class", "mark").attr("viewBox", "0 -5 10 10").attr("refX", 10).attr("refY", 0).attr("markerWidth", 10).attr("markerHeight", 10).attr("orient", "auto").append("path").attr("fill", "#546e7a").attr("d", "M0,-5L10,0L0,5");
    var p = d3.selectAll(".levLab")
      , y = p[0][0].getBBox()
      , u = p[0][1].getBBox()
      , f = p[0][2].getBBox()
      , h = p[0][3].getBBox()
      , g = .03 * e
      , m = y.x + y.width
      , v = u.x
      , k = u.x + u.width
      , x = f.x
      , b = f.x + f.width
      , w = h.x
      , A = i.append("g").attr("transform", "translate(" + l.left + "," + l.top + ")").attr("class", "arrows");
    A.append("line").attr("x1", m + 3 * g).attr("y1", y.y + 9).attr("x2", v - g).attr("y2", y.y + 9).style("stroke", "#eaeaea").attr("marker-end", "url(#marker)"),
    A.append("line").attr("x1", k + g).attr("y1", y.y + 9).attr("x2", x - g).attr("y2", y.y + 9).style("stroke", "#eaeaea").attr("marker-end", "url(#marker)"),
    A.append("line").attr("x1", b + g).attr("y1", y.y + 9).attr("x2", w - g).attr("y2", y.y + 9).style("stroke", "#eaeaea").attr("marker-end", "url(#marker)");
    var B = i.append("g").attr("transform", "translate(" + l.left + "," + l.top + ")").selectAll("path").data(links);
    B.enter().append("path").attr("class", "link backLink").attr("d", function(e) {
        if ("f" !== e.source_id.charAt(0)) {
            if (e.source_id.charAt(0) == e.target_id.charAt(0)) {
                var t = (jobsDataset.filter(function(t) {
                    return t.key == e.source_id
                }),
                jobsDataset.filter(function(t) {
                    return t.key == e.target_id
                }),
                2 * Math.PI * s * .25 - 8)
                  , a = 2 * Math.PI * s * .25 - 8
                  , l = nodes[e.target].x - nodes[e.source].x
                  , r = nodes[e.target].y - nodes[e.source].y
                  , n = Math.sqrt(.4 * (l * l + r * r));
                return nodes[e.source].y > nodes[e.target].y ? "M" + (nodes[e.source].x - a / 2) + "," + (nodes[e.source].y - a / 2) + "A" + n + "," + n + " 0 0,1 " + (nodes[e.target].x - t / 2) + "," + (nodes[e.target].y + t / 2) : "M" + (nodes[e.source].x + a / 2) + "," + (nodes[e.source].y + a / 2) + "A" + n + "," + n + " 0 0,1 " + (nodes[e.target].x + t / 2) + "," + (nodes[e.target].y - t / 2)
            }
            var i = (jobsDataset.filter(function(t) {
                return t.key == e.source_id
            }),
            jobsDataset.filter(function(t) {
                return t.key == e.target_id
            }),
            {
                x: nodes[e.source].y,
                y: nodes[e.source].x + s
            })
              , c = {
                x: nodes[e.target].y,
                y: nodes[e.target].x - s
            };
            return o({
                source: i,
                target: c
            })
        }
    }).style("display", "none");
    var _ = (B.enter().append("path").attr("class", "link frontLink").attr("marker-end", "url(#marker)").attr("d", function(e) {
        if ("f" !== e.source_id.charAt(0)) {
            if (e.source_id.charAt(0) == e.target_id.charAt(0)) {
                var t = (jobsDataset.filter(function(t) {
                    return t.key == e.source_id
                }),
                jobsDataset.filter(function(t) {
                    return t.key == e.target_id
                }),
                2 * Math.PI * s * .25 - 8)
                  , a = 2 * Math.PI * s * .25 - 8
                  , l = nodes[e.target].x - nodes[e.source].x
                  , r = nodes[e.target].y - nodes[e.source].y
                  , n = Math.sqrt(.4 * (l * l + r * r));
                return nodes[e.source].y > nodes[e.target].y ? "M" + (nodes[e.source].x - a / 2) + "," + (nodes[e.source].y - a / 2) + "A" + n + "," + n + " 0 0,1 " + (nodes[e.target].x - t / 2) + "," + (nodes[e.target].y + t / 2) : "M" + (nodes[e.source].x + a / 2) + "," + (nodes[e.source].y + a / 2) + "A" + n + "," + n + " 0 0,1 " + (nodes[e.target].x + t / 2) + "," + (nodes[e.target].y - t / 2)
            }
            var i = (jobsDataset.filter(function(t) {
                return t.key == e.source_id
            }),
            jobsDataset.filter(function(t) {
                return t.key == e.target_id
            }),
            {
                x: nodes[e.source].y,
                y: nodes[e.source].x + s
            })
              , c = {
                x: nodes[e.target].y,
                y: nodes[e.target].x - s
            };
            return o({
                source: i,
                target: c
            })
        }
    }).style("display", "none"),
    i.append("g").attr("transform", "translate(" + l.left + "," + l.top + ")"))
      , C = _.selectAll("g").data(nodes).enter().append("g").attr("class", "circleCont");
    C.append("circle").attr("class", "jobRoles").attr("id", function(e) {
        return e.id
    }).attr("cx", function(e) {
        return e.x
    }).attr("cy", function(e) {
        return e.y
    }).attr("r", function() {
        return s
    }).on("mouseover", function(e) {
        highlightSelection(e, this),
        showToolTip(e, this)
    }).on("mouseout", function() {
        d3.selectAll(".circleCont").select("text").style("opacity", 1),
        d3.selectAll(".jobRoles").style("stroke", "#29B6F6").style("stroke-width", "2px").style("fill", "#f7f8f9"),
        d3.selectAll(".link").style("display", "none"),
        d3.select(".tooltip").style("display", "none")
    }).on("click", function(e, t) {
        1 == clicked && e.id == clickedId ? unclick() : clickHandler(e, t, this),
        console.log("BOX HEIGHT"),
        setBoxHeight()
    });
    C.append("text").attr("x", function(e) {
        return e.x
    }).attr("y", function(e) {
        return e.y
    }).attr("dy", ".35em").style("text-anchor", "middle").text(function(e) {
        return e.name
    }).call(wrap, 80);
    d3.selectAll(".circleCont").selectAll("tspan").attr("y", function(e) {
        var t = d3.select(this.parentNode).selectAll("tspan");
        return 1 == t[0].length ? pathwayW > 685 ? e.y : e.y + 25 : 2 == t[0].length ? pathwayW > 685 ? e.y - 5 : e.y + 25 : 3 == t[0].length ? pathwayW > 685 ? e.y - 13 : e.y + 25 : e.y - 18
    }),
    i.append("text").attr("class", "rolesType").text("Common Cybersecurity Feeder Roles").attr("y", 13).attr("x", function() {
        return r("Feeder")
    }).attr("dy", ".35em").style("font-weight", 600).attr("text-anchor", "start").call(wrap, 140);
    var S = i.append("g").attr("class", "feederBlock").style("display", "none").style("opacity", 0);
    i.append("image").attr("class", "infIcon labelsInf").attr("width", "17px").attr("height", "15px").attr("xlink:href", "./images/i_03.png").attr("id", "feederInf").attr("y", 19).attr("x", 119).on("mouseover", function() {
        d3.select(".feederBlock").style("display", "block").transition().duration(250).style("opacity", 1),
        d3.select(".rolesInfoBG").transition().duration(250).style("display", "block")
    }).on("mouseout", function() {
        d3.select(".feederBlock").transition().duration(250).style("opacity", 0).style("display", "block").each("end", function() {
            d3.select(".rolesInfoBG").transition().duration(250).style("display", "none")
        })
    }),
    S.append("rect").attr("class", "rolesInfoBG").attr("y", 38).attr("x", function() {
        return r("Feeder")
    }).attr("width", 160).attr("height", 260).style("fill", "#eceff1"),
    S.append("text").attr("class", "rolesInfo").text("Common cybersecurity feeder roles are career areas that are most likely to serve as stepping stones into a career in cybersecurity. Many career areas may prepare workers for jobs in cybersecurity, but common feeder roles were identified by analyzing similarities in skill requirements between jobs and pinpointing those jobs with significant skill overlap with multiple core cybersecurity roles.").attr("y", 53).attr("x", function() {
        return r("Feeder") + 8
    }).attr("dy", ".35em").attr("text-anchor", "start").style("font-size", "12px").call(wrap, 148),
    i.append("text").attr("class", "rolesType").text("Core Cybersecurity Roles").attr("y", 13).attr("x", function() {
        return r("Mid-Level")
    }).attr("dy", ".35em").style("font-weight", 600).attr("text-anchor", "start"),
    i.append("image").attr("class", "infIcon labelsInf").attr("width", "17px").attr("height", "15px").attr("xlink:href", "./images/i_03.png").attr("id", "coreInf").attr("y", 5).attr("x", function() {
        return r("Mid-Level") + 146
    }).on("mouseover", function() {
        d3.select(".coreBlock").style("display", "block").transition().duration(250).style("opacity", 1),
        d3.select(".coreInfoBG").transition().duration(250).style("display", "block")
    }).on("mouseout", function() {
        d3.select(".coreBlock").transition().duration(250).style("opacity", 0).style("display", "block").each("end", function() {
            d3.select(".coreInfoBG").transition().duration(250).style("display", "block")
        })
    });
    var T = i.append("g").attr("class", "coreBlock").style("display", "none").style("opacity", 0);
    T.append("rect").attr("class", "coreInfoBG").attr("y", 28).attr("x", function() {
        return r("Mid-Level") - 58
    }).attr("width", 300).attr("height", 100).style("fill", "#eceff1"),
    T.append("text").attr("class", "rolesInfo").text("Core cybersecurity roles are the most commonly requested job categories across the cybersecurity ecosystem.  They are classified as entry-level, mid-level, or advanced-level based upon the experience, education levels, and credentials requested by employers.").attr("y", 43).attr("x", function() {
        return r("Mid-Level") - 50
    }).attr("dy", ".35em").attr("text-anchor", "start").style("font-size", "12px").call(wrap, 290)
}
function clickHandler(e, t, s) {
    $(".table").css("opacity", 1),
    $(".table").slideDown("fast"),
    "Feeder" === e.level && 1 == once ? ($(".no1").children().css("display", "none"),
    $(".no1").append($(".no5").children()),
    d3.select("#no4").selectAll(".toChange").style("letter-spacing", "-0.2px").html("TOP CYBERSECURITY SKILLS TO ADD"),
    d3.select("#no4").selectAll(".def").html("Shows the skills that workers in this feeder role will most likely need to develop to prepare for roles in cybersecurity."),
    $(".no5").append($("#no4").children()),
    $("#no4").append($("#no6").children()),
    $("#no6").css("display", "none"),
    $("#c3 > .line").css("display", "none"),
    $(".no5").addClass("long").css("border-left", "1px solid #CFD8DC"),
    $(".no3").css("border-right", "0px"),
    $("#c4").insertBefore($("#c3")),
    $(".no1").next().insertBefore($(".no1")),
    $("#no2").insertBefore($(".no1").prev()),
    $(".no1").css("margin-top", "15px"),
    $("#no2").css({
        "margin-top": "0px",
        "margin-bottom": "15px"
    }),
    $(".feeder").css("display", "block"),
    $(".core").css("display", "none"),
    once = !1) : "Feeder" === e.level && 0 == once || void 0 !== $("#no2").next()[0] && ($(".no1").children().css("display", "block"),
    $("#b1").css("display", "none"),
    $("#b5").css("display", "none"),
    $(".no3").css("border-right", "1px solid #CFD8DC"),
    $("#c3 > .line").css("display", "block"),
    $("#no6").append($("#no4").children()),
    $(".no5").removeClass("long").css("border-left", "0px"),
    $("#no6").css("display", "block"),
    $("#no4").append($(".no5").children()),
    $(".no5").append($("#b5"), $("#b5").next()),
    d3.select("#no4").selectAll(".toChange").style("letter-spacing", "0px").html("COMMON NICE CYBERSECURITY WORKFORCE FRAMEWORK CATEGORIES"),
    d3.select("#no4").selectAll(".def").html("Shows common NICE Cybersecurity Workforce Framework Categories that map to a particular job. Within each Framework Category are Specialty Areas that correspond to on-the-job competencies that may be required of workers in a particular role"),
    $(".no1").insertBefore($("#no2")),
    $("#no2").next().insertBefore($("#no2")),
    $("#no2").css("margin-top", "15px"),
    $(".no1").css({
        "margin-top": "0px",
        "margin-bottom": "15px"
    }),
    $(".feeder").css("display", "none"),
    $(".core").css("display", "block"),
    $("#c3").insertBefore($("#c4")),
    once = !0),
    d3.select(".job").html(e.name),
    d3.selectAll(".link").style("display", "none");
    var a = jobsDataset.filter(function(t) {
        return t.key == e.id
    });
    d3.select(".salaryNum").html("$" + formatThousand(a[0].values[0].average_salary)),
    d3.selectAll(".circ").style("opacity", .5).style("stroke-width", "0px"),
    d3.selectAll(".jobTitle").style("display", "none"),
    d3.selectAll(".number").style("display", "none"),
    d3.select("#average_salarySvg").selectAll("rect").style("display", "none"),
    d3.select("#job_openingsSvg").selectAll("rect").style("display", "none");
    var l = d3.select(s).attr("id");
    d3.select("#average_salarySvg").select("#rect" + l).moveToFront().style("display", "inherit"),
    d3.select("#average_salarySvg").select("#cf" + l).moveToFront().style("fill", "#f46d43").style("opacity", 1).style("stroke", "#455A64").style("stroke-width", "2px"),
    d3.select("#average_salarySvg").select("#tsf" + l).moveToFront().style("display", "inherit"),
    d3.select(".openingsNumber").html(formatThousand(a[0].values[0].job_openings)),
    d3.select("#job_openingsSvg").select("#rect" + l).moveToFront().style("display", "inherit"),
    d3.select("#job_openingsSvg").select("#cf" + l).moveToFront().style("fill", "#74add1").style("opacity", 1).style("stroke", "#455A64").style("stroke-width", "2px"),
    d3.select("#job_openingsSvg").select("#tsf" + l).moveToFront().style("display", "inherit"),
    highlightSelection(e, s),
    fillList("commonJobsList", e.id, "common_job_titles"),
    fillList("topCertificationsList", e.id, "top_certifications"),
    fillList("topSkillsList", e.id, "top_skills"),
    "Feeder" === e.level ? ($(".areas").css("display", "none"),
    $("#topSkillsToAddList").css("display", "block"),
    fillList("topSkillsToAddList", e.id, "top_skills_add")) : ($(".areas").css("display", "block"),
    $("#topSkillsToAddList").css("display", "none")),
    d3.selectAll(".educationChart").style("display", "inherit"),
    updateStackedBar(e.id),
    fillAreas(e.id),
    d3.selectAll(".jobRoles").on("mouseover", null).on("mouseout", null),
    clicked = !0,
    clickedId = e.id,
    d3.select(".tooltip").style("display", "none")
}
function highlightSelection(e, t) {
    var s = e.id;
    d3.selectAll(".jobRoles").style("stroke", "#d4f0fd").style("stroke-width", "2px").style("fill", "#f7f8f9"),
    d3.selectAll(".circleCont").select("text").style("opacity", .2);
    var a = d3.selectAll(".link").filter(function(e) {
        return nodes[e.source].id == s
    })
      , l = d3.selectAll(".link").filter(function(e) {
        return nodes[e.target].id == s
    })
      , r = d3.selectAll(".frontLink").filter(function(e) {
        return nodes[e.source].id == s
    })
      , n = d3.selectAll(".frontLink").filter(function(e) {
        return nodes[e.target].id == s
    });
    a.style("display", "inherit"),
    l.style("display", "inherit");
    for (var o = 0; o < r[0].length; o++) {
        var i = d3.select(r[0][o])
          , c = r[0][o].getTotalLength();
        i.attr("stroke-dasharray", c + " " + c).attr("stroke-dashoffset", c).transition().duration(250).ease("linear").attr("stroke-dashoffset", 0),
        d3.selectAll(".circleCont").filter(function(e) {
            return e.name == nodes[a[0][o].__data__.target].name
        }).select("text").style("opacity", 1),
        d3.selectAll(".circleCont").filter(function(e) {
            return e.name == nodes[a[0][o].__data__.target].name
        }).select("circle").style("stroke", "#29B6F6")
    }
    for (var o = 0; o < n[0].length; o++) {
        var i = d3.select(n[0][o])
          , c = n[0][o].getTotalLength();
        i.attr("stroke-dasharray", c + " " + c).attr("stroke-dashoffset", c).transition().duration(250).ease("linear").attr("stroke-dashoffset", 0),
        d3.selectAll(".circleCont").filter(function(e) {
            return e.name == nodes[l[0][o].__data__.source].name
        }).select("text").style("opacity", 1),
        d3.selectAll(".circleCont").filter(function(e) {
            return e.name == nodes[l[0][o].__data__.source].name
        }).select("circle").style("stroke", "#29B6F6")
    }
    d3.select(t.parentNode).select("text").style("opacity", 1),
    d3.select(t).style("stroke", "#455a64").style("stroke-width", "3px").style("fill", "#9addfb")
}
function unclick() {
    $(".table").slideUp("fast"),
    d3.select(".job").html(" "),
    d3.selectAll(".circleCont").select("text").style("opacity", 1),
    d3.selectAll(".jobRoles").style("stroke", "#29B6F6").style("stroke-width", "2px").style("fill", "#f7f8f9"),
    d3.selectAll(".link").style("display", "none"),
    d3.selectAll(".circ").style("opacity", .5).style("stroke-width", "0px"),
    d3.selectAll(".jobRoles").on("mouseover", function(e) {
        highlightSelection(e, this),
        showToolTip(e, this)
    }).on("mouseout", function() {
        d3.selectAll(".circleCont").select("text").style("opacity", 1),
        d3.selectAll(".link").style("display", "none"),
        d3.selectAll(".jobRoles").style("stroke", "#29B6F6").style("stroke-width", "2px").style("fill", "#f7f8f9"),
        d3.select(".tooltip").style("display", "none")
    }),
    clicked = !1,
    clickedId = ""
}
function showToolTip(e, t) {
    var s, a = jobsDataset.filter(function(t) {
        return t.key == e.id
    });
    s = "f" !== e.id.charAt(0) ? "<div class='tipJob'>" + e.name + "</div><div class='var'>Job openings</div><div class='tipValue op'>" + formatThousand(a[0].values[0].job_openings) + "</div><div class='var'>Average salary</div><div class='tipValue sal'>$" + formatThousand(a[0].values[0].average_salary) + "</div><div class='more'>Click the circle for more info</div>" : "<div class='tipJob'>" + e.name + "</div><div class='var'>Job openings</div><div class='tipValue op'>" + formatThousand(a[0].values[0].job_openings) + "</div><div class='more'>Click the circle for more info</div>",
    d3.select(".tooltip").html(s).style("display", "inherit");
    var l = d3.select(".tooltip").node().getBoundingClientRect()
      , r = d3.select(".pathway").node().getBoundingClientRect();
    d3.select(".tooltip").style("top", e.y + 65 + +d3.select(t).attr("r") + "px").style("left", e.x + .1 * r.width - l.width / 2 + "px")
}
function drawCircleChart(e, t) {
    var s = [];
    jobsDataset.forEach(function(t) {
        var a = {};
        a.id = t.key,
        a.title = t.values[0].job_title,
        a.value = +t.values[0][e],
        s.push(a)
    });
    var a = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
      , l = d3.select(t).select(".boxContent").node().getBoundingClientRect().width - (a.left + a.right)
      , r = 120
      , n = 15
      , o = s.filter(function(e) {
        return "f" == e.id.charAt(0)
    })
      , i = s.filter(function(e) {
        return "f" !== e.id.charAt(0)
    })
      , c = d3.scale.linear().domain(d3.extent(o, function(e) {
        return e.value
    })).range([20, l - 20])
      , d = d3.scale.linear().domain(d3.extent(i, function(e) {
        return e.value
    })).range([20, l - 20])
      , p = d3.select("#" + e + "Chart").append("svg").attr("id", e + "Svg").attr("width", l).attr("height", r);
    p.append("line").style("stroke", "#455A64").attr("x1", 0).attr("y1", r / 2).attr("x2", l).attr("y2", r / 2);
    var y = (p.selectAll("circles").data(s).enter().append("circle").attr("id", function(e) {
        return "cf" + e.id
    }).attr("class", function(t) {
        return "f" == t.id.charAt(0) ? e + " circ feeder" : e + " circ core"
    }).attr("cy", r / 2).attr("r", n).attr("cx", function(e) {
        return "f" == e.id.charAt(0) ? c(e.value) : d(e.value)
    }).on("mouseover", function(t) {
        d3.select(this).moveToFront().style("stroke", "#455A64").style("stroke-width", "2px").style("opacity", 1),
        d3.select("#" + e + "Svg").select("#rect" + t.id).moveToFront().style("display", "inherit"),
        d3.select("#" + e + "Svg").select("#tf" + t.id).moveToFront().style("display", "inherit"),
        d3.select("#" + e + "Svg").select("#tsf" + t.id).moveToFront().style("display", "inherit"),
        d3.select(d3.select("#" + e + "Svg").select("#tsf" + t.id)[0][0].parentNode).moveToFront(),
        d3.select("#" + e + "Svg").select("#rect" + clickedId).style("display", "none"),
        d3.select("#" + e + "Svg").select("#tsf" + clickedId).style("display", "none")
    }).on("mouseout", function(t) {
        d3.select(this).moveToBack().style("stroke", "none").style("opacity", .5),
        d3.select("#" + e + "Svg").select("#rect" + t.id).moveToBack().style("display", "none"),
        d3.select("#" + e + "Svg").select("#tf" + t.id).style("display", "none"),
        d3.select("#" + e + "Svg").select("#tsf" + t.id).style("display", "none"),
        d3.select("#" + e + "Svg").select("#cf" + clickedId).moveToFront().style("stroke", "#455A64").style("stroke-width", "2px").style("opacity", 1),
        d3.select("#" + e + "Svg").select("#rect" + clickedId).moveToFront().style("display", "inherit"),
        d3.select("#" + e + "Svg").select("#tsf" + clickedId).moveToFront().style("display", "inherit")
    }).on("click", function(e, t) {
        var s = d3.select("#" + e.id)[0][0].__data__
          , a = d3.select("#" + e.id)[0][0];
        clickHandler(s, t, a),
        setBoxHeight()
    }),
    p.selectAll("nums").data(s).enter().append("g"));
    y.append("text").text(function(e) {
        return formatThousand(e.value)
    }).attr("id", function(e) {
        return "tf" + e.id
    }).attr("class", e + " number").attr("x", function(e) {
        return "f" == e.id.charAt(0) ? c(e.value) : d(e.value)
    }).attr("y", r / 2 + 2 * n + 3).attr("text-anchor", function() {
        var e = d3.select(this).node().getBBox();
        return e.x + e.width / 2 >= l - 5 ? "end" : e.x - e.width / 2 <= 10 ? "start" : "middle"
    }).style("display", "none"),
    y.append("text").text(function(e) {
        return e.title
    }).attr("id", function(e) {
        return "tsf" + e.id
    }).attr("class", e + " jobTitle").attr("x", function(e) {
        return "f" == e.id.charAt(0) ? c(e.value) : d(e.value)
    }).attr("y", 50).attr("dy", ".45em").attr("text-anchor", "middle").call(wrap, 80),
    d3.select(".salaryNum").html("$0"),
    d3.select("#" + e + "Chart").selectAll(".jobTitle").each(function(t) {
        var s = d3.select(this).node().getBBox()
          , a = +d3.select("#" + e + "Svg").select("#cf" + t.id).attr("cy") - +d3.select("#" + e + "Svg").select("#cf" + t.id).attr("r") / 2;
        s.y + s.height >= a - 5 && d3.select(this).selectAll("tspan").attr("y", a - (s.height + 5)),
        s.x + s.width / 2 >= l - 35 && d3.select(this).selectAll("tspan").attr("x", l - s.width / 2),
        s.x - s.width / 2 <= 25 && "m3" != t.id && d3.select(this).selectAll("tspan").attr("x", 10 + s.width / 2);
        var r = d3.select(this).node().getBBox();
        d3.select(this.parentNode).insert("rect", ":first-child").attr("id", function(e) {
            return "rect" + e.id
        }).attr("class", "rect_jobTitle").attr("x", r.x - 10).attr("y", r.y).attr("width", r.width + 20).attr("height", r.height).attr("fill", "#fff").style("display", "none")
    }),
    d3.selectAll(".jobTitle").style("display", "none")
}
function fillList(e, t, s) {
    for (var a = jobsDataset.filter(function(e) {
        return e.key == t
    }), l = [], r = 1; 10 > r; r++) {
        var n = a[0].values[0][s + "_" + r];
        void 0 != n && n.length > 2 && l.push(a[0].values[0][s + "_" + r])
    }
    document.getElementById(e).innerHTML = "",
    d3.select("#" + e).selectAll("li").data(l).enter().append("li").html(function(e) {
        return e
    })
}
function drawStackedBar() {
    causes = ["Sub-BA", "Bachelor's Degree", "Graduate Degree"],
    colors = ["#6e016b", "#8c6bb1", "#bfd3e6"],
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 25
    },
    width = d3.select(".no5").select(".boxContent").node().getBoundingClientRect().width - (margin.left + margin.right),
    height = 70,
    x = d3.scale.linear().rangeRound([2, width]),
    barSvg = d3.select(".educationChart").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
}
function updateStackedBar(e) {
    var t = jobsDataset.filter(function(t) {
        return t.key == e
    })
      , s = [+t[0].values[0]["sub-ba"], +t[0].values[0].bachelor, +t[0].values[0].graduate];
    x.domain([0, 100]);
    var a = [0, x(s[0]), x(s[0]) + x(s[1])]
      , l = barSvg.selectAll("rect").data(s);
    l.enter().append("rect").attr("y", height / 1.47).attr("height", barHeight).attr("stroke", "#fff").attr("stroke-width", 2).attr("fill", function(e, t) {
        return colors[t]
    });
    l.transition().duration(500).attr("x", function(e, t) {
        return a[t]
    }).attr("width", function(e) {
        return x(e)
    });
    var r = barSvg.selectAll(".barNum").data(s);
    r.enter().append("text").attr("class", "barNum").attr("y", margin.top + barHeight + 16).attr("dy", ".35em").attr("text-anchor", "end");
    r.transition().duration(500).attr("x", function(e, t) {
        return e > 6 ? a[t] + x(e) - 5 : 0
    }).text(function(e) {
        return e
    }).attr("fill", function(e, t) {
        return e > 6 && 0 == t || 1 == t ? "#fff" : "333"
    });
    var n = barSvg.selectAll(".causeLabels").data(s);
    n.enter().append("text").attr("class", "causeLabels").attr("y", margin.top).attr("dy", ".35em");
    n.attr("text-anchor", function(e) {
        return 10 > e ? "middle" : "end"
    }).attr("x", function(e, t) {
        return a[t] + x(e) - 5
    }).text(function(e, t) {
        return causes[t]
    }).call(wrap, 70);
    var o = d3.select(n[0][0]).node().getBBox()
      , i = Number(d3.select(n[0][0]).attr("x")) + o.width / 2
      , c = d3.select(n[0][1]).node().getBBox()
      , d = Number(d3.select(n[0][1]).attr("x")) - c.width / 2
      , p = Number(d3.select(n[0][1]).attr("x")) + c.width / 2
      , y = d3.select(n[0][2]).node().getBBox()
      , u = Number(d3.select(n[0][2]).attr("x")) - y.width / 2;
    i >= d || p >= u ? d3.select(n[0][1]).selectAll("tspan").attr("x", function() {
        return d3.select(this).attr("x") - 15
    }) : d3.select(r[0][1]).attr("y", margin.top + barHeight + 16)
}
function fillAreas(e) {
    var t = catsData.filter(function(t) {
        return t.key == e
    });
    if (d3.select(".ksas").html(""),
    d3.select(".tasks").html(""),
    d3.selectAll(".areaBtns").remove(),
    d3.selectAll(".subCatsUl").remove(),
    d3.select(".row2").style("display", "none"),
    null != t[0]) {
        var s = d3.select(".areas").selectAll("areaBtns").data(t[0].values).enter().append("div").attr("id", function(e, t) {
            return "area" + t
        }).attr("class", "areaBtns accordion").html(function(e) {
            return e.key
        }).on("click", function() {
            d3.select(this.nextSibling).classed("show", function() {
                return 1 == d3.select(this).classed("show") ? (d3.selectAll(".accordion").classed("active", !1),
                !1) : (d3.selectAll(".subCatsUl").classed("show", !1),
                d3.selectAll(".accordion").classed("active", !1),
                d3.select(this.previousSibling).classed("active", !0),
                !0)
            }),
            setBoxHeight()
        });
        d3.select(".ksas").append("div").attr("class", "noData").html("No data"),
        d3.select(".tasks").append("div").attr("class", "noData").html("No data"),
        s.each(function(e, t) {
            d3.select(".areas").insert("ul", "#area" + (t + 1)).attr("class", "subCatsUl").selectAll("subCats").data(e.values).enter().append("li").attr("class", "subCatsLi").attr("id", function(e) {
                return idStrip(e.key)
            }).html(function(e) {
                return e.key
            }).on("click", function(e) {
                d3.select(this).classed("active", function() {
                    return 0 == d3.select(this).classed("active") ? (d3.select(".row2").style("display", "block"),
                    d3.selectAll(".subCatsLi").classed("active", !1),
                    d3.selectAll(".ksa").style("display", "none"),
                    d3.selectAll(".task").style("display", "none"),
                    d3.select(".ksas").selectAll("." + idStrip(e.key))[0][0].childNodes.length >= 0 && (d3.select(".ksas").selectAll("." + idStrip(e.key)).style("display", "none"),
                    d3.select(".ksas").select(".noData").style("display", "block")),
                    0 == d3.select(".tasks").selectAll("." + idStrip(e.key))[0][0].childNodes.length ? (d3.select(".tasks").selectAll("." + idStrip(e.key)).style("display", "none"),
                    d3.select(".tasks").select(".noData").style("display", "block")) : (d3.select(".ksas").select(".noData").style("display", "none"),
                    d3.select(".tasks").select(".noData").style("display", "none"),
                    d3.select(".ksas").selectAll("." + idStrip(e.key)).style("display", "block"),
                    d3.select(".tasks").selectAll("." + idStrip(e.key)).style("display", "block")),
                    !0) : (d3.select(".row2").style("display", "none"),
                    d3.selectAll(".ksa").style("display", "none"),
                    d3.selectAll(".task").style("display", "none"),
                    !1)
                });
                var t = document.getElementById("scrollTo")
                  , s = getOffsetTop(t);
                animatedScrollTo(document.body, s, 500)
            })
        }),
        d3.selectAll(".subCatsLi").each(function(e) {
            var t = e;
            d3.select(".ksas").append("ul").attr("class", function() {
                return "ksa " + idStrip(t.key)
            }).style("display", "none").selectAll("ksaList").data(e.values).enter().append("li").html(function(e) {
                return e.ksa
            }),
            d3.select(".tasks").append("ul").attr("class", function() {
                return "task " + idStrip(t.key)
            }).style("display", "none").selectAll("taskList").data(e.values).enter().append("li").html(function(e) {
                return e.tasks
            })
        }),
        d3.select(".tasks").selectAll("li").each(function() {
            "" == d3.select(this).html() && d3.select(this).remove()
        }),
        d3.select(".ksas").selectAll("li").each(function() {
            "" == d3.select(this).html() && d3.select(this).remove()
        })
    }
}
function copyToClipboard(e) {
    var t, s, a = "_hiddenCopyText_", l = "INPUT" === e.tagName || "TEXTAREA" === e.tagName;
    if (l)
        r = e,
        t = e.selectionStart,
        s = e.selectionEnd;
    else {
        if (r = document.getElementById(a),
        !r) {
            var r = document.createElement("textarea");
            r.style.position = "absolute",
            r.style.left = "-9999px",
            r.style.top = "0",
            r.id = a,
            document.body.appendChild(r)
        }
        r.textContent = e.textContent
    }
    var n = document.activeElement;
    r.focus(),
    r.setSelectionRange(0, r.value.length);
    var o;
    try {
        o = document.execCommand("copy")
    } catch (i) {
        o = !1
    }
    return n && "function" == typeof n.focus && n.focus(),
    l ? e.setSelectionRange(t, s) : r.textContent = "",
    o
}
function getOffsetTop(e) {
    var t = 0;
    do
        isNaN(e.offsetTop) || (t += e.offsetTop);
    while (e = e.offsetParent);return t
}
function setBoxHeight() {
    var e = document.getElementById("no4").offsetHeight;
    if (pathwayW > 1e3 && pathwayW > 575)
        void 0 !== clickedId && "f" !== clickedId.charAt(0) ? (document.getElementById("no2").style.height = e + "px",
        document.getElementById("no6").style.height = e + "px") : document.getElementById("no2").style.height = "160px";
    else {
        if (575 >= pathwayW)
            return;
        document.getElementById("no6").style.height = e + "px"
    }
}
function wrap(e, t) {
    e.each(function() {
        for (var e, s = d3.select(this), a = s.text().split(/\s+/).reverse(), l = [], r = 0, n = 1.1, o = s.attr("y"), i = s.attr("x"), c = parseFloat(s.attr("dy")), d = s.text(null).append("tspan").attr("x", i).attr("y", o).attr("dy", c + "em"); e = a.pop(); )
            l.push(e),
            d.text(l.join(" ")),
            d.node().getComputedTextLength() > t && (l.pop(),
            d.text(l.join(" ")),
            l = [e],
            d = s.append("tspan").attr("x", i).attr("y", o).attr("dy", ++r * n + c + "em").text(e))
    })
}
function idStrip(e) {
    var t = e.replace(/\s+/g, "")
      , s = t.replace(/\.+/g, "")
      , a = s.replace(/\'+/g, "")
      , l = a.toLowerCase()
      , r = l.substring(0, 20)
      , n = r.replace(/\,+/g, "")
      , o = n.replace(/\/+/g, "")
      , i = o.replace(/\&+/g, "")
      , c = i.replace(/\-/g, "");
    return c
}
var graph, levels = ["Feeder", "Entry-Level", "Mid-Level", "Advanced-Level"], jobsDataset, catsData, nodes, links, clicked = !1, clickedId, formatThousand = d3.format(",d"), pathwayW, once = !0;
queue().defer(d3.csv, "data/career_pathway_links_data.csv").defer(d3.csv, "data/career_pathway_jobs_data.csv").defer(d3.csv, "data/areas_subcategories_ksa.csv").await(ready);
var causes, colors, margin, width, height, x, barSvg, barHeight = 45;
document.getElementById("copyButton").addEventListener("click", function() {
    copyToClipboard(document.getElementById("copyTarget"))
}),
d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this)
    })
}
,
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var e = this.parentNode.firstChild;
        e && this.parentNode.insertBefore(this, e)
    })
}
;
