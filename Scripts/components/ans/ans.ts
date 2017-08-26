import Vue from 'vue';
import { Component } from 'vue-property-decorator';//不能被注释掉！
import jQuery from 'jquery';
var $ = jQuery.noConflict();
// import '../../../node_modules/font-awesome/css/font-awesome.css';
var set = require('./questions.js').set;
var answerCard = require('./questions.js').answerCard;
var saveAnsID = require('./ans.js').saveAnsID;
var saveAns = require('./ans.js').saveAns;
var submit = require('./ans.js').submit;
require('../../../Images/banner.jpg');
require('../../../Images/bg.jpg');
require('../../../Images/overlay.png');
require('../../../Images/pic01.jpg');
var globalQ = {};
export default {
	data() {
		return {
		}
	},
	mounted() {
		// this.send(),
			this.initialize(),
			this.load(),
			this.loadcss()
	},
	methods: {
		initialize: function () {
			var _this = this;
			var settings = {
				"async": true,
				// "crossDomain": true,
				"url": "/api/Student/State/Initialize",
				"method": "GET",
				"headers": {
					"content-type": "application/json",
					"cache-control": "no-cache",
				}
			}
			$.ajax(settings).done(function (response) {
				// alert(JSON.stringify(response));
				if(response.testState==1){//获取试卷
					if(response.isSeedSet == true){
						var setQuestions = {
							"async":false,
							"url":"/api/Question",
							"method":"GET",
							"contentType":"application/json",
						}
						$.ajax(setQuestions).done(function(questions){
							globalQ=questions,
							set(questions),
							answerCard(questions)
						})
					}
					else {
						alert ("Seed unset! Just hold on a second...")
						var reset = {
							"async": true,
							// "crossDomain": true,
							"url": "/api/Student/State/Reset",
							"method": "POST",
							"headers": {
								"content-type": "application/json",
								"cache-control": "no-cache",
							}
						}
						$.ajax(reset).done(function(reset){
							alert(JSON.stringify(reset))
						})
						alert("Boom! Bug exterminated! Now, please press F5.")
					}
				}
				else{
					_this.$router.push('/ans/result')
				}
					
			});
		},
		load: function () {
			var inTime = true;
			var currentPage = 0;
			$(document).on("click", "#wrapper input", function (id) {
				var ID = $(id.target).attr('id');
				if (ID != "submit") {
					saveAns(ID);
				} else {
					alert(JSON.stringify(globalQ));
					saveAnsID(globalQ);
					submit(inTime);
				}
			});
			//page-scroll for icon fa-angle-right
			$(document).on("click", "#wrapper a.fa-angle-right", function (e) {
				var v_id = $(e.target).attr('id');
				if (v_id == "start") {
					$('#wrapper').animate({
						left: "-=115rem"
					}, 300);
					currentPage = 1;
				} else {
					$('#wrapper').animate({
						left: "-=120rem"
					}, 300);
					currentPage++;
				}
			});
			//page-scroll for footer
			$(document).on("click", "#answerCard a.questionId", function (c) {
				var tgt = $(c.target).attr('id');
				if (tgt.length == 9) {
					var tgtId = parseInt(tgt[8]);
				} else {
					var tgtId = parseInt(tgt[8]) * 10 + parseInt(tgt[9]);
				}
				if (tgtId < currentPage) {
					var M = currentPage - tgtId;
					for (var i = 0; i < M; i++) {
						$('#wrapper').animate({
							left: "+=120rem"
						}, 300 / (currentPage - tgtId));
						currentPage--;
					}
				} else if (tgtId > currentPage) {
					var M = tgtId - currentPage;
					for (var i = 0; i < M; i++) {
						$('#wrapper').animate({
							left: "-=120rem"
						}, 300 / (tgtId - currentPage));
						currentPage++;
					}
				}
			});
			var mm = 30;//分
			var ss = 0;//秒
			var timeState = false;//时间状态 默认为true 开启时间
			/*实现计时器*/

			var time = setInterval(function () {
				if (timeState) {
					if (mm == 0 && ss == 1) {
						ss--;
						alert("时间到！");
						inTime = false;
						submit(inTime);
						$(".time").hide();
					}
					else {
						var str = "";
						if (ss-- == 0) {
							--mm;
							ss = 59;
						}
						str += mm < 10 ? "0" + mm : mm;
						str += ":";
						str += ss < 10 ? "0" + ss : ss;
						$(".time").text(str);
					}

				}
				else {
					$(".time").text(' ');
				}
			}, 1000);
			var answerQues = [];//name,answer(id)
			$(document).ready(function () {
				$("#start").click(function () {
					$("#footer").show();
					timeState = true;
				});
			});
		},
		loadcss: function () {
			$("body").css("display", "flex");
			$("body").css("background-image", "url(/dist/Images/overlay.png), url(/dist/Images/bg.jpg)");

		}
	}
}