/********************Webpage Common Configurations********************/
var DepartmentNameMap={
    1:"建筑学院",
    2:"机械工程学院",
    3:"能源与环境学院",
    4:"信息科学与工程学院",
    5:"土木工程学院",
    6:"电子科学与工程学院",
    7:"数学学院",
    8:"自动化学院",
    9:"计算机科学与工程学院、软件学院",
    71:"计算机科学与工程学院、软件学院"
}
var config={
    department:null,
    departmentName:null,
    departmentInfo:{}, //summuray of current department
    generalInfo:{
        allDepartments:[], //all departments enum
        summary:{}, //general
        statistics:[] //summary of all departments
    },
    scoreList:null,
    undoList:[],
    undoNumber:null,
    doneList:[],
    doneNumber:null,
    total:null,
    comments:{
        dones:{
            perfect:"大家都很听话，全部完成作答了哦！",
            common:""         
        },
        undos:{
            worst:"偌大的学院，到现在还没有一人完成，大家都去哪儿浪了呢？",
            common:""
        }
    }

}
/********************Webpage Setting********************/
function setUndoNDo(SCORES){
    var undo=[];
    var done=[];
    for(var scoresIteratorIndex=0;scoresIteratorIndex<SCORES.length;scoresIteratorIndex++){
        if(SCORES[scoresIteratorIndex].isCompleted){
            done.push(SCORES[scoresIteratorIndex]);
        }
        else{
            undo.push(SCORES[scoresIteratorIndex]);
        }
    }
    config.scoreList=SCORES;
    config.undoList=undo;
    config.undoNumber=undo.length;
    config.doneList=done;
    config.doneNumber=done.length;
    config.total=undo.length+done.length;
    config.comments.dones.common=done.length+"人已完成答题,";
    config.comments.undos.common="仍有"+config.undoNumber+"人未完成。"
    console.log( config.undoList);
    
    console.log(config.undoNumber=undo.length);
    console.log( config.doneList);
    console.log(config.doneNumber);
    console.log(config.comments.dones.common);
    console.log(config.comments.undos.common);

}


   
function setUndo(UNDO){
    var undoContent=""       
    for(var undoIteratorIndex=0;undoIteratorIndex<UNDO.length;undoIteratorIndex++){
        undoContent+='<tr><td>'+UNDO[undoIteratorIndex].studentID
        +'</td><td>'+UNDO[undoIteratorIndex].name
        +'</td><td>'+UNDO[undoIteratorIndex].cardID+'</td></tr>'
    }
   
    $("#table-undo").find("tbody").html(undoContent);
   
}
function setDone(DONE){
    var  doneContent="";
    for(var doneIteratorIndex=0;doneIteratorIndex<DONE.length;doneIteratorIndex++){
        doneContent+='<tr><td>'+DONE[doneIteratorIndex].studentID
        +'</td><td>'+DONE[doneIteratorIndex].name
        +'</td><td>'+DONE[doneIteratorIndex].score
        +'</td><td>'+DONE[doneIteratorIndex].cardID+'</td></tr>'
    }
    $("#table-done").find("tbody").html(doneContent);
}
function setGeneralData(){
    fetchAllDepartments(); 
}
function setChartist(){ 
    var labelForDone=Math.round(100*(config.doneNumber/config.total))+"%";
    var labelForUndo=Math.round(100*(config.undoNumber/config.total))+"%";
    var labelA=Math.round(100*(config.departmentInfo.scoreBandCount.higherThan90/config.doneNumber))+"%";
    var labelB=Math.round(100*(config.departmentInfo.scoreBandCount.failed/config.doneNumber))+"%";
    var labelC=Math.round(100*(config.departmentInfo.scoreBandCount.higherThan75/config.doneNumber))+"%";
    var labelD=Math.round(100*(config.departmentInfo.scoreBandCount.higherThan60/config.doneNumber))+"%";
    
    Chartist.Pie('#completion-chart', {   
        labels: [(config.doneNumber==0?'':labelForDone),
                (config.undoNumber==0?'':labelForUndo)],
        series: [config.doneNumber, config.undoNumber]
    });   
    //若无人作答，显示相应提示信息
    if(config.doneNumber==0){
        Chartist.Pie('#overall-chart', {
            
            labels: [
               "尚未有学生作答"
            ],
            series: [
                100
            ]
        });  
    }
    else{
        Chartist.Pie('#overall-chart', {
            
            labels: [
                (config.departmentInfo.scoreBandCount.higherThan90==0?'':labelA),
                (config.departmentInfo.scoreBandCount.failed==0?'':labelB),
                (config.departmentInfo.scoreBandCount.higherThan75==0?'':labelC),
                (config.departmentInfo.scoreBandCount.higherThan60==0?'':labelD)
            ],
            series: [
                config.departmentInfo.scoreBandCount.higherThan90,
                config.departmentInfo.scoreBandCount.failed,
                config.departmentInfo.scoreBandCount.higherThan75,
                config.departmentInfo.scoreBandCount.higherThan60
            ]
        });   
    }
}
function setGeneralChartist(){
    var gDoneNum=config.generalInfo.summary.scoreBandCount.failed
        +config.generalInfo.summary.scoreBandCount.higherThan60
        +config.generalInfo.summary.scoreBandCount.higherThan75
        +config.generalInfo.summary.scoreBandCount.higherThan90;
    var gUndoNum=config.generalInfo.summary.scoreBandCount.notTested;
    var gTot=gDoneNum+gUndoNum;
    var labelForDone=Math.round(100*(gDoneNum/gTot))+"%";
    var labelForUndo=Math.round(100*(gUndoNum/gTot))+"%";
    var labelA=Math.round(100*(config.generalInfo.summary.scoreBandCount.higherThan90/gDoneNum))+"%";
    var labelB=Math.round(100*(config.generalInfo.summary.scoreBandCount.failed/gDoneNum))+"%";
    var labelC=Math.round(100*(config.generalInfo.summary.scoreBandCount.higherThan75/gDoneNum))+"%";
    var labelD=Math.round(100*(config.generalInfo.summary.scoreBandCount.higherThan60/gDoneNum))+"%";

    Chartist.Pie('#completion-chart-general', {   
    labels: [(gDoneNum==0?'':labelForDone),
    (gUndoNum==0?'':labelForUndo)],
    series: [gDoneNum, gUndoNum]
    });   
    //若无人作答，显示相应提示信息
    if(gDoneNum==0){
    Chartist.Pie('#overall-chart-general', {

    labels: [
    "尚未有学生作答"
    ],
    series: [
    100
    ]
    });  
    }
    else{
    Chartist.Pie('#overall-chart-general', {

    labels: [
    (config.generalInfo.summary.scoreBandCount.higherThan90==0?'':labelA),
    (config.generalInfo.summary.scoreBandCount.failed==0?'':labelB),
    (config.generalInfo.summary.scoreBandCount.higherThan75==0?'':labelC),
    (config.generalInfo.summary.scoreBandCount.higherThan60==0?'':labelD)
    ],
    series: [
    config.generalInfo.summary.scoreBandCount.higherThan90,
    config.generalInfo.summary.scoreBandCount.failed,
    config.generalInfo.summary.scoreBandCount.higherThan75,
    config.generalInfo.summary.scoreBandCount.higherThan60
    ]
    });   
    }
}
function setGENERAL(){
    var generalContent="";
    var STAT=config.generalInfo.statistics;
      console.log(STAT);
    for(var statIteratorIndex=0;statIteratorIndex<STAT.length;statIteratorIndex++){
        var donenum = STAT[statIteratorIndex].studentCount - STAT[statIteratorIndex].scoreBandCount.notTested;
        var average = STAT[statIteratorIndex].averageScore.toFixed(2);
        var completion = 100 * (1 - STAT[statIteratorIndex].scoreBandCount.notTested/STAT[statIteratorIndex].studentCount);
        var proportionA = Math.round (100 * (STAT[statIteratorIndex].scoreBandCount.higherThan90/donenum));
        var proportionB = Math.round (100 * (STAT[statIteratorIndex].scoreBandCount.higherThan75/donenum));
        var proportionC = Math.round (100 * (STAT[statIteratorIndex].scoreBandCount.higherThan60/donenum));
        var proportionD = Math.round (100 * (STAT[statIteratorIndex].scoreBandCount.failed/donenum));
        generalContent+='<tr><td>'+STAT[statIteratorIndex].departmentID
        +'</td><td>'+average
        +'</td><td>'+completion
        +'</td><td>'+proportionA
        +'</td><td>'+proportionB
        +'</td><td>'+proportionC
        +'</td><td>'+proportionD+'</td></tr>'
    }
    $("#table-general").find("tbody").html(generalContent);
}
function commonSet(){
    console.log(config.departmentName);
    $("#school-name").html(config.departmentName);
    if(config.undoNumber==0){
        $("#done-info").html(config.comments.dones.perfect);
        $("#undo-info").hide();
        $("#empty-comment").show();
    }
    else if(config.doneNumber==0){
        $("#done-info").hide();
        $("#undo-info").html(config.comments.undos.worst);
        $("#empty-comment").hide();
    }
    else{
        $("#done-info").html(config.comments.dones.common);
        $("#undo-info").html(config.comments.undos.common);
        $("#empty-comment").hide();
    }
    $("#average-score").html(config.departmentInfo.averageScore.toFixed(2));
    $("#max-score").html(config.departmentInfo.maxScore);

}
/********************Variable Needed for Search********************/
var temp=new Array();
var cnt=0;
var by = function(name){
    return function(o, p){
        var a, b;
        if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name];
            b = p[name];
            if (a === b) {
            return 0;
            }
            if (typeof a === typeof b) {
            return a < b ? 1 : -1;
            }
            return typeof a < typeof b ? 1 : -1;
        }
        else {
            throw ("error");
        }
    }
}
/********************API Interfaces********************/
//Initialize the Score Tab, call this function only once.
function setScoreData(){
    $.ajax({
        url:  '/api/Counselor/Department', 
        async: true,   
        type: "GET", 
        contentType:"application/json",
        dataType: "json", 
        success: function (req) {
         console.log(req);
         config.department=req;
         console.log(config.department);
         fetchSummary(config.department,fetchAllScores);
        },
        error: function (xhr) {
          alert("数据获取失败，请检查网络！");
          console.log(xhr);
        }
    });
}
//When department summary is fetched, a callback may be needed to fetch all scores of current department.
//However, Counselor CANNOT get scores of other departments.
//To fetch general summary of all departments, no params are needed.
function fetchSummary(department,callback){
    if(department==undefined){
        department="";
    }
    else{
        department='/'+department;
    }
    $.ajax({
        url:  '/api/Counselor/Scores/Summary'+department,
        contentType:"application/json",
        dataType: "json", 
        async: false, 
        type: "GET", 
        success: function (req) {
            //Department Info
            if(req.departmentID!=undefined){
                //counselor department
                if(req.departmentID==config.department){
                    console.log(req);
                    config.departmentInfo=req;
                    console.log(config.departmentInfo);
                    config.departmentName=DepartmentNameMap[config.departmentInfo.departmentID];
                    console.log(config.departmentInfo.departmentID);
                    config.generalInfo.statistics[0] = req;// !!!danger
                }
                //other
                else{
                    console.log(req);
                    config.generalInfo.statistics.push(req);
                }
                if(callback!=undefined){
                    callback();
                }
            }
            //General Info
            else{
                console.log(req);
                config.generalInfo.summary=req;
                console.log( config.generalInfo.summary);
                //set chartist
                if(callback!=undefined){
                    callback();
                }

            }
        },
        error: function () {
          alert("数据获取失败，请检查网络！");
        }
      });
       
}
//Ensure Counselor CANNOT get scores of other departments.
//Set tab1 tables
function fetchAllScores(){
   
    $.ajax({
        url:  '/api/Counselor/Scores/All', 
        contentType:"application/json",
        dataType: "json", 
        async: true, 
        type: "GET", 
        success: function (req) {
          console.log(req);
          setUndoNDo(req);
          setUndo(config.undoList);
          setDone(config.doneList);
          setChartist();
          commonSet();
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
      });
}
function fetchAllStudents(){
    $.ajax({
        url:  '/api/Counselor/AllStudents', 
        contentType:"application/json",
        dataType: "json", 
        async: true, 
        type: "GET", 
        success: function (req) {
          console.log(req);
          
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
      });
}
//fetch department id enum & statistics
function fetchAllDepartments(){
    $.ajax({
        url:  '/api/Counselor/AllDepartments', 
        contentType:"application/json",
        dataType: "json", 
        async: true, 
        type: "GET", 
        success: function (req) {
          console.log(req);
          config.generalInfo.allDepartments=req;
          for(var i=0;i<config.generalInfo.allDepartments.length;i++){
              if(i+1<config.generalInfo.allDepartments.length){
                fetchSummary(config.generalInfo.allDepartments[i]);
              }
              else{
                fetchSummary(config.generalInfo.allDepartments[i],setGENERAL);
              }
          }
          
         
        },
        error: function (xhr) {
            console.log(xhr);
            alert("数据获取失败，请检查网络！");
        }
      });
}
function downloadDepartmentExcel(){
    $.ajax({
    url:  '/api/Counselor/ExportExcelofDepartment',
    async: true, 
    type: "POST", 
    contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    success: function (req) {
      window.location = '/excel/'+req;
    },
    error: function (xhr) {
      alert("数据获取失败，请检查网络！");
      console.log(xhr);
    }
  });
}
function downloadExcelOfAllDepartments(){
    $.ajax({
        url:  '/api/Counselor/ExportExcelOfAllDepartments', //请求的url地址
        async: true, //请求是否异步，默认为异步，这也是ajax重要特性
        crossDomain:true,
        type: "POST", //请求方式
        contentType:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        success: function (req) {
            console.log(req);
            window.location = '/excel/'+req;
        },
        error: function (xhr) {
            alert("数据获取失败，请检查网络！");
            console.log(xhr);
        }
  });
}

/********************Document Ready Function********************/
$(function () {
    
  setScoreData();
 
  setGeneralData();
    //Refresh
    $("#refresh-button").click(function(){
       setScoreData();
    })
    //Download
    $(".department-excel").click(function(){
        downloadDepartmentExcel();
    })
    $(".all-departments").click(function(){
        downloadExcelOfAllDepartments();
    })
    //Sort
    $("#table-done").find("th.score").click(function(){
       if(cnt%3==0){
        $("#sort").hide();
        $("#triangle-bottom").show();
        $("#triangle-top").hide();
           if(cnt==0){
            temp=config.doneList.slice(0);//深拷贝 !important
            temp.sort(by("score"));
            setDone(temp);
            cnt++;
            return;
           }
           temp.reverse();
           cnt++;
           setDone(temp);
   
       }
       else if(cnt%3==1){
        $("#sort").hide();
        $("#triangle-bottom").hide();
        $("#triangle-top").show();
        temp.reverse();
        cnt++;
        setDone(temp);

       }
       else if(cnt%3==2){
        $("#sort").show();
        $("#triangle-bottom").hide();
        $("#triangle-top").hide();
        cnt++;
        setDone(config.doneList);

       }
       
       
      
    })
    //Search 先隐藏再筛选
     $("#search-undo-text").keyup(function () {
         var $key=$('#search-undo-text').val();
         $('#table-undo table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });
     $("#search-done-text").keyup(function () {
         var $key=$('#search-done-text').val();        
         $('#table-done table tbody tr').hide().filter(":contains('"+$key+"')").show();
     });

     
     var searchVisible = 0;
     var transparent = true;
     
     var transparentDemo = true;
     var fixedTop = false;
     
     var navbar_initialized = false;
     
     $(document).ready(function(){
         window_width = $(window).width();
         
         // check if there is an image set for the sidebar's background
         lbd.checkSidebarImage();
         
         // Init navigation toggle for small screens   
         if(window_width <= 991){
             lbd.initRightMenu();   
         }
          
         //  Activate the tooltips   
         $('[rel="tooltip"]').tooltip();
     
         //      Activate the switches with icons 
         if($('.switch').length != 0){
             $('.switch')['bootstrapSwitch']();
         }  
         //      Activate regular switches
         if($("[data-toggle='switch']").length != 0){
              $("[data-toggle='switch']").wrap('<div class="switch" />').parent().bootstrapSwitch();     
         }
          
         $('.form-control').on("focus", function(){
             $(this).parent('.input-group').addClass("input-group-focus");
         }).on("blur", function(){
             $(this).parent(".input-group").removeClass("input-group-focus");
         });
           
     });
     
     // activate collapse right menu when the windows is resized 
     $(window).resize(function(){
         if($(window).width() <= 991){
             lbd.initRightMenu();   
         }
     });
         
     lbd = {
         misc:{
             navbar_menu_visible: 0
         },
         
         checkSidebarImage: function(){
             $sidebar = $('.sidebar');
             image_src = $sidebar.data('image');
             
             if(image_src !== undefined){
                 sidebar_container = '<div class="sidebar-background" style="background-image: url(' + image_src + ') "/>'
                 $sidebar.append(sidebar_container);
             }  
         },
         initRightMenu: function(){  
              if(!navbar_initialized){
                 $navbar = $('nav').find('.navbar-collapse').first().clone(true);
                 
                 $sidebar = $('.sidebar');
                 sidebar_color = $sidebar.data('color');
                 
                 $logo = $sidebar.find('.logo').first();
                 logo_content = $logo[0].outerHTML;
                         
                 ul_content = '';
                  
                 $navbar.attr('data-color',sidebar_color);
                  
                 // add the content from the sidebar to the right menu
                 content_buff = $sidebar.find('.nav').html();
                 ul_content = ul_content + content_buff;
                 
                 //add the content from the regular header to the right menu
                 $navbar.children('ul').each(function(){
                     content_buff = $(this).html();
                     ul_content = ul_content + content_buff;   
                 });
                  
                 ul_content = '<ul class="nav navbar-nav">' + ul_content + '</ul>';
                 
                 navbar_content = logo_content + ul_content;
                 
                 $navbar.html(navbar_content);
                  
                 $('body').append($navbar);
                  
                 background_image = $sidebar.data('image');
                 if(background_image != undefined){
                     $navbar.css('background',"url('" + background_image + "')")
                            .removeAttr('data-nav-image')
                            .addClass('has-image');                
                 }
                  
                  
                  $toggle = $('.navbar-toggle');
                  
                  $navbar.find('a').removeClass('btn btn-round btn-default');
                  $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
                  $navbar.find('button').addClass('btn-simple btn-block');
                 
                  $toggle.click(function (){    
                     if(lbd.misc.navbar_menu_visible == 1) {
                         $('html').removeClass('nav-open'); 
                         lbd.misc.navbar_menu_visible = 0;
                         $('#bodyClick').remove();
                          setTimeout(function(){
                             $toggle.removeClass('toggled');
                          }, 400);
                     
                     } else {
                         setTimeout(function(){
                             $toggle.addClass('toggled');
                         }, 430);
                         
                         div = '<div id="bodyClick"></div>';
                         $(div).appendTo("body").click(function() {
                             $('html').removeClass('nav-open');
                             lbd.misc.navbar_menu_visible = 0;
                             $('#bodyClick').remove();
                              setTimeout(function(){
                                 $toggle.removeClass('toggled');
                              }, 400);
                         });
                        
                         $('html').addClass('nav-open');
                         lbd.misc.navbar_menu_visible = 1;
                         
                     }
                 });
                 navbar_initialized = true;
             }
        
         }
     }
     
     
     // Returns a function, that, as long as it continues to be invoked, will not
     // be triggered. The function will be called after it stops being called for
     // N milliseconds. If `immediate` is passed, trigger the function on the
     // leading edge, instead of the trailing.
     
     function debounce(func, wait, immediate) {
         var timeout;
         return function() {
             var context = this, args = arguments;
             clearTimeout(timeout);
             timeout = setTimeout(function() {
                 timeout = null;
                 if (!immediate) func.apply(context, args);
             }, wait);
             if (immediate && !timeout) func.apply(context, args);
         };
     };
     
 



});



