var FlockSON=function(){var d=this;this.errors={E1:"More than one question with the same ID"};this.answer=function(){this.getAnswerText=function(){return this.answerText};this.setAnswerText=function(b){this.answerText=b};this.getJumpID=function(){return this.jumpID};this.setjumpID=function(b){this.jumpID=b};this.setValue=function(b){this.answerValue=b};this.getValue=function(){return this.answerValue};this.initializeVariables=function(){this.answerValue=this.jumpID=this.answerText=null};this.serializeJSON=
function(){var b={};null!=this.answerText?b.Text=this.answerText:console.log("No Text in Answer :-(");null!=this.jumpID?""!=this.jumpID?b.JumpID=this.jumpID:console.log("JumpID in Question is empty"):console.log("No JumpID in Answer :-(");null!=this.answerValue?""!=this.answerValue?b.Value=this.answerValue:console.log("Value in Question is empty"):console.log("No Value in Answer :-(");var a={};a.Answer=b;return a};this.deserializeJSON=function(b){this.initializeVariables();b=d.getJSON(b);if(null!=
b){var a=null;"Answer"in b?a=b.Answer:console.log("No Answer in Object :-(");null!=a&&("Answer"in b?a=b.Answer:console.log("No Survey in Object :-("),"Text"in a?this.answerText=a.Text:console.log("No Text in Answer :-("),"JumpID"in a?(this.jumpID=""!=a.JumpID)?this.jumpID=a.JumpID:(this.jumpID=null,console.log("JumpID in Answer is empty")):(this.jumpID=null,console.log("No JumpID in Answer :-(")),"Value"in a?""!=a.Value&&(this.answerValue=a.Value):console.log("No Value in Question :-("))}else console.log("JSON not parsed correctly, Answer is not correct JSON :-(")};
this.constructFromJSON=function(b){"Answer"in b?this.answerText=b.Answer:console.log("No answer text in answer object :-(");"Jump"in b&&(this.jumpID=b.Jump)};this.answerValue=this.jumpID=this.answerText=null;this.initializeVariables()};this.question=function(b){this.getKind=function(){return this.kind};this.setKind=function(a){this.kind=a};this.getQuestionText=function(){return this.questionText};this.setQuestionText=function(a){this.questionText=a};this.getAnswers=function(){return this.answers};
this.setAnswers=function(a){this.answers=a};this.getJumpID=function(){return this.jumpID};this.setjumpID=function(a){this.jumpID=a};this.getQuestionID=function(){return this.questionID};this.setQuestionID=function(a){this.questionID=a};this.isOtherEnabled=function(){return this.otherEnabled};this.setOtherEnabled=function(a){this.otherEnabled=a};this.getLoopQuestions=function(){return this.loopQuestions};this.setLoopQuestions=function(a){this.loopQuestions=a};this.initializeVariables=function(){this.inLoop=
b;this.kind=null;this.loopQuestions=[];this.questionText=null;this.answers=[];this.jumpID=this.otherEnabled=this.questionID=null};this.serializeJSON=function(){var a={};null!=this.kind?a.Kind=this.kind:console.log("Kind in Question is null");null!=this.questionID?a.ID=this.questionID:console.log("ID in Question is null");null!=this.questionText?a.Text=this.questionText:console.log("Text in Question is null");null!=this.jumpID?""!=this.jumpID?a.JumpID=this.jumpID:(a.JumpID=null,console.log("JumpID in Question is empty")):
(a.JumpID=null,console.log("JumpID in Question is null"));null!=this.otherEnabled?a.Other=this.otherEnabled:console.log("Other in Question is null :-(");var b=new d.questionKind(this.inloop);if(this.kind===b.MULTIPLE_CHOICE.jsonName||this.kind===b.CHECKBOX.jsonName||this.kind===b.ORDERED.jsonName)if(null!==this.answers&&0<this.answers.length){for(var c=this.answers.length,e=[],f=0;f<c;f++)e.push(this.answers[f].serializeJSON());a.Answers=e}else console.log("No Ansers or empty Answers Array in MC, CB or OL quesiton :-(");
if(this.kind===b.LOOP.jsonName&&0==this.inLoop)if(null!==this.loopQuestions&&0<this.loopQuestions.length){c=this.loopQuestions.length;b=[];for(f=0;f<c;f++)b.push(this.loopQuestions[f].serializeJSON());a.Questions=b}else console.log("No Questions or empty Questions Array in LP quesiton :-(");c={};c.Question=a;return c};this.deserializeJSON=function(a){this.initializeVariables();var b=new d.questionKind(this.inloop);a=d.getJSON(a);if(null!=a){var c=null;"Question"in a?c=a.Question:console.log("No Question in Object :-(");
if(null!=c){if("Kind"in c){var e=c.Kind,f=b.getJsonNames(),h=!1;for(a=0;a<f.length;a++)f[a]===e&&(this.kind=e,h=!0);h||console.log("Kind in Question object is not a valid value :-(")}else console.log("No Kind in Question :-(");"Text"in c?this.questionText=c.Text:console.log("No Text in Question :-(");"ID"in c?""!=c.ID&&(this.questionID=c.ID):console.log("No ID in Question :-(");"JumpID"in c?""!=c.JumpID&&(this.jumpID=c.JumpID):(this.jumpID=null,console.log("No JumpID in Question :-("));if(this.kind===
b.MULTIPLE_CHOICE.jsonName||this.kind===b.CHECKBOX.jsonName)this.otherEnabled="Other"in c?c.Other:!1;if(this.kind===b.MULTIPLE_CHOICE.jsonName||this.kind===b.CHECKBOX.jsonName||this.kind===b.ORDERED.jsonName)if("Answers"in c)if(c=c.Answers,Array.isArray(c))for(this.answers=[],a=0;a<c.length;a++)this.answers.push(new d.answer),this.answers[a].deserializeJSON(c[a]);else console.log("Answers in Question is not an Array :-(");else console.log("No Answers in Question object :-(");if(this.kind===b.LOOP.jsonName&&
0==this.inLoop)if("Questions"in object)if(b=object.Questions,Array.isArray(b))for(this.loopQuestions=[],a=0;a<b.length;a++)this.loopQuestions.push(new question(!0)),this.loopQuestions[a].deserializeJSON(b[a]);else console.log("Questions in LP Question is not an Array :-(");else console.log("No Questions in LP Question object :-(")}}else console.log("JSON not parsed correctly, Question is not correct JSON :-(")};this.getQuestionById=function(a){var b=null,c=0,e=new d.questionKind(!1);if(this.kind==
e.LOOP.jsonName)for(e=0;e<this.loopQuestions.length;e++)this.loopQuestions[e].getQuestionID()==a&&(b=this.loopQuestions[e],c++);if(1<c)throw d.errors.E1;return b};this.inLoop=b;this.kind=null;this.loopQuestions=[];this.questionText=null;this.answers=[];this.jumpID=this.otherEnabled=this.questionID=null;this.initializeVariables()};this.questionKind=function(b){this.inLoop=b;this.MULTIPLE_CHOICE={jsonName:"MC",name:"Multiple choice"};this.OPEN_NUMBER={jsonName:"ON",name:"Open number"};this.OPEN_TEXT=
{jsonName:"OT",name:"Open text"};this.IMAGE={jsonName:"IM",name:"Picture"};this.CHECKBOX={jsonName:"CB",name:"Checkbox"};this.ORDERED={jsonName:"OL",name:"Ordered list"};this.LOOP={jsonName:"LP",name:"Loop"};this.getJsonNames=function(){var a=[];a.push(this.OPEN_TEXT.jsonName);a.push(this.OPEN_NUMBER.jsonName);a.push(this.MULTIPLE_CHOICE.jsonName);a.push(this.CHECKBOX.jsonName);a.push(this.ORDERED.jsonName);a.push(this.IMAGE.jsonName);this.inLoop||a.push(this.LOOP.jsonName);return a};this.getNames=
function(){var a=[];a.push(this.OPEN_TEXT.name);a.push(this.OPEN_NUMBER.name);a.push(this.MULTIPLE_CHOICE.name);a.push(this.CHECKBOX.name);a.push(this.ORDERED.name);a.push(this.IMAGE.name);this.inLoop||a.push(this.LOOP.name);return a}};this.chapter=function(){this.getTitle=function(){return this.title};this.setTitle=function(b){this.title=b};this.getQuestions=function(){return this.questions};this.setQuestions=function(b){this.questions=b};this.addQuestion=function(b){this.questions.push(b)};this.getQuestionCount=
function(){return null==this.questions?0:this.questions.length};this.initializeVariables=function(){this.title=null;this.questions=[]};this.serializeJSON=function(){var b={};b.Title=this.title;if(null!=this.questions){var a=[],d;for(d in this.questions)a.push(this.questions[d].serializeJSON());b.Questions=a}else b.Questions=null;a={};a.Chapter=b;return a};this.deserializeJSON=function(b){this.initializeVariables();b=d.getJSON(b);if(null!=b){var a=null;"Chapter"in b?a=b.Chapter:console.log("No Chapter in Object :-(");
if(null!=a)if("Title"in a?this.title=a.Title:console.log("No Title in Chapter object :-("),"Questions"in a)if(b=a.Questions,b.constructor===Array){this.questions=[];for(var g in b)a=new d.question,a.deserializeJSON(b[g]),this.questions.push(a)}else console.log("Questions in Chapter is not a JSONArray :-(");else console.log("No Questions in Chapter object :-(")}else console.log("JSON not parsed correctly, Chapter is not correct JSON :-(")};this.getQuestionById=function(b){for(var a=null,g=0,c=0;c<
this.questions.length;c++){this.questions[c].getQuestionID()==b&&(a=this.questions[c],g++);var e=new d.questionKind(!1);if(this.questions[c].getKind()==e.LOOP.jsonName){try{var f=this.questions[c].getQuestionById(b)}catch(h){if(h=d.errors.E1)throw d.errors.E1;}null!=f&&(a=f,g++)}}if(1<g)throw d.errors.E1;return a};this.title=null;this.questions=[];this.initializeVariables()};this.survey=function(){this.getFlockScript=function(){return this.flockSctipt};this.setFlockScript=function(b){this.flockSctipt=
b};this.getTitle=function(){return this.title};this.setTitle=function(b){this.title=b};this.getFlockSONversion=function(){return this.flockSONversion};this.setFlockSONversion=function(b){this.flockSONversion=b};this.getChapters=function(){return this.chapters};this.setChapters=function(b){this.chapters=b};this.addChapter=function(b){this.chapters.push(b)};this.getChapterCount=function(){return null==this.chapters?0:chapters.length};this.initializeVariables=function(){this.chapters=[];this.flockSctipt=
this.title=this.flockSONversion=null};this.serializeJSON=function(){var b={};if("0.1"==this.flockSONversion)if(b.flockSONversion=this.flockSONversion,b.Title=this.title,b.FlockScript=this.flockSctipt,null!=this.chapters){var a=[],d;for(d in this.chapters)a.push(this.chapters[d].serializeJSON());b.Chapters=a}else b.Chapters=null;else console.log("Incorrect flockSONversion :-(");a={};a.Survey=b;return a};this.deserializeJSON=function(b){this.initializeVariables();b=d.getJSON(b);if(null!=b){var a=null;
"Survey"in b?a=b.Survey:console.log("No Survey in Object :-(");if(null!=a)if("flockSONversion"in a)if("0.1"==a.flockSONversion)if(this.flockSONversion=a.flockSONversion,"Title"in a?this.title=a.Title:console.log("No Title in Survey object :-("),"FlockScript"in a?this.flockSctipt=a.FlockScript:console.log("No FlockScript in Survey object :-("),"Chapters"in a)if(b=a.Chapters,b.constructor===Array){this.chapters=[];for(var g in b)a=new d.chapter,a.deserializeJSON(b[g]),this.chapters.push(a)}else console.log("Chapters in Survey is not a JSONArray :-(");
else console.log("No Chapters in Survey object :-(");else console.log("Incorrect flockSONversion in Survey :-(");else console.log("No flockSONversion in Survey :-(");else console.log("JSON not parsed correctly, Survey is not correct JSON :-(")}};this.getQuestionById=function(b){for(var a=null,g=0,c=0;c<this.chapters.length;c++){try{var e=this.chapters[c].getQuestionById(b)}catch(f){if(f=d.errors.E1)throw d.errors.E1;}null!=e&&(a=e,g++)}if(1<g)throw d.errors.E1;return a};this.chapters=[];this.flockSctipt=
this.title=this.flockSONversion=null;this.initializeVariables()};this.getJSON=function(b){var a=null;if(b.constructor==={}.constructor)a=b;else try{a=JSON.parse(b)}catch(d){}return a}};