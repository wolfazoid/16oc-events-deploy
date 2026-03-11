(function() {
  // Inject CSS styles
  const styles = `
#widget-coming-up.thalia , #widget-full-feed.thalia, #widget-coming-up.empty-bottle, #widget-full-feed.empty-bottle, #widget-coming-up.promontory, #widget-full-feed.promontory, #widget-coming-up.space, #widget-full-feed.space {
  text-align: center;
}

* {
  -webkit-transition: all .5s;
  transition: all .5s;
}

.venue-nav {text-align:  center;}
li.new-venue-switcher {
  display:  inline-block;
  background-color:  lightgray;
  width: 20%;
  cursor:  pointer;
}
li.new-venue-switcher a {
  display: block;
  padding:  20px;
  color: black;
}

#widget-coming-up .eb-item {
    height: auto;
    margin: 0px 0px 20px 0px;
}

#widget-coming-up .content-front {
  grid-template-columns: 0.7fr 0.3fr;
  grid-template-areas:
    'item-image show-details'
    'action-buttons action-buttons';
}

#widget-coming-up .item-image-inner {
  grid-area: item-image;
  height: 400px;
}

#widget-coming-up .buttons-outer {
  grid-area: action-buttons;
}

#widget-search-event-date {
  width: 100%;
}

#widget-coming-up .show-details {
  grid-area: show-details;
  height: 100%;
  position: relative;
  top: 0%;
  right: 0%;
  color: white;
  display:  flex;
  flex-direction:  column;
}

#widget-coming-up .empty-bottle .show-details {
  background-color: #eaeaea;
}

#widget-coming-up .show-details .venue {
  padding-bottom: 1rem;
}

#widget-coming-up .item-description {
  height: 85%;
  margin: 0% 2% 2% 2%
}

#widget-coming-up .content-front.visible-description{
  top: -90%;
}
#widget-coming-up .content-back.visible-description {
  top: 0%;
}

#widget-coming-up .event-venue {
  width: 70%;
}

#widget-full-feed {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

#widget-full-feed.all {
  padding: 0 1rem;
}

#widget-event-modal-container,
#widget-event-modal,
#widget-search-controls-form,
#widget-pagination-container {
  --input-background-color: #fff;
  --content-background-color: #fff;
  --body-font-family: Helvetica, Arial, sans-serif;
  --input-font-family: Helvetica, Arial, sans-serif;
  --input-border-color: rgba(0, 0, 0, 0.3);
  --input-border-color-hover: rgba(0, 0, 0, 0.5);
  --input-border-color-active: rgba(0, 0, 0, 0.8);
  --input-padding: 0.6rem;
  --input-accent-color: rgba(73, 113, 156, 1.000);
}

#widget-event-modal-container {
  position: fixed;
  display: grid;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-sizing: border-box;
}

#widget-event-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  z-index: 1000;
}


#widget-event-modal-content {
  position: relative;
  display: grid;
  justify-content: center;
  z-index: 1001;
  overflow-y: auto;
  max-height: 100lvh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
}

#widget-event-modal-close {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  cursor: pointer;
}

#widget-event-modal-close:after {
  display: inline-block;
  content: "\\00d7"; /* This will render the 'X' */
  font-size: 1.5rem;
}

#widget-event-modal-dialog {
  position: relative;
  max-width: 500px;
  background: white;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  font-family: var(--body-font-family);
  background-color: var(--content-background-color);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  line-height: 1.3;
}

#widget-event-modal-dialog h3,
#widget-event-modal-dialog h4,
#widget-event-modal-dialog h5,
#widget-event-modal-dialog p,
#widget-event-modal-dialog img
{
  margin: 0;
  padding: 0;
}

#widget-event-modal-dialog img {
  width: 100%;
}

#widget-event-modal-dialog table td {
  padding: 1rem 0;
  border-top: solid var(--input-border-color) 1px;
}

#widget-event-modal-dialog table td:last-child {
  text-align: right;
}

#widget-event-modal-dialog table tr:first-child td {
  border-top: none;
}

#widget-event-modal-dialog.info {
  max-width: 420px;
}

#widget-event-modal-dialog .buy-button {
  padding: 1rem 0.5rem;
  text-align: center;
  font-family: var(--body-font-family);
}

#widget-search-controls-container {
  padding: 1rem 0 1rem;
}

#widget-search-controls-title {
  font-size: 3.125rem;
  text-align: center;
  margin: 2rem 0;
}

#widget-search-controls-form {
  position: relative;
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  font-family: var(--input-font-family);
  border: solid var(--input-border-color) 1px;
  padding: 1rem;
  margin: 0 1rem;
  background: var(--content-background-color);
}

#widget-search-controls-form .search-control {
  position: relative;
  cursor: pointer;
  box-sizing: border-box;
  font-size: 1rem;
  line-height: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

#widget-search-controls-form div.search-control {
  padding-right: 2.2rem;
  line-height: 1.2;
}

#widget-search-controls-form input.search-control {
  font-family: inherit;
  border: solid var(--input-border-color) 1px;
  padding: var(--input-padding);
  background-color: var(--input-background-color);
  color: var(--input-text-color);
  line-height: 1.2;
}

#widget-search-controls-form input.search-control:focus,
#widget-search-controls-form input.search-control:focus-visible {
  outline-offset: 0;
  outline: auto 2px Highlight;
  outline: auto 5px -webkit-focus-ring-color;
}

#widget-search-controls-form .search-control svg {
  position: absolute;
  top: 50%;
  transform: translate3d(0, -50%, 0);
  right: 0.75rem;
  height: 1rem;
  width: 1rem;
}

#widget-search-venue-filter-selection svg path {
  stroke: currentColor;
}

#widget-search-genre-filter-selection svg path {
  fill: currentColor;
  opacity: 0.6;
}

#widget-search-controls-form .search-control-container {
  position: relative;
  border: solid var(--input-border-color) 1px;
  padding: var(--input-padding);
  background-color: var(--input-background-color);
  color: var(--input-text-color);
}

#widget-search-controls-form .search-control-container.active {
  outline: auto 2px Highlight;
  outline: auto 5px -webkit-focus-ring-color;
}

#widget-search-controls-form .search-control:hover {
  border-color: var(--input-border-color-hover);
}

#widget-search-controls-form .search-control.active {
  border-color: var(--input-border-color-active);
}

#widget-search-controls-form .widget-checkbox-group {
  display: none;
  align-items: start;
  justify-content: start;
  max-height: 50vh;
  overflow-y: auto;
  border: solid var(--input-border-color) 1px;
  padding: var(--input-padding);
  position: absolute;
  left: 0;
  top: calc(100% + 0.5rem);
  z-index: 1000;
  width: 100%;
  background-color: #fff;
  box-sizing: border-box;
}

.widget-search-empty-results-set {
  width: 100%;
  text-align: center;
  grid-column: 1/-1;
}

.widget-checkbox-group span:first-child {
  display: grid;
  align-content: center;
}

.widget-checkbox-group input {
  accent-color: var(--input-accent-color);
  padding: 0;
  margin: -1px 0 0;
}

.widget-checkbox-group label {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: max-content 1fr;
}

#widget-search-controls-form .search-control.active ~ .widget-checkbox-group {
  display: grid;
  gap: var(--input-padding);
  background-color: var(--input-background-color);
}

#widget-event-modal-header {
}

#widget-clear-filter-button {
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0.5rem 2rem;
}

#widget-clear-filter-button:hover {
  outline: none;
  border: none;
  background: transparent;
  opacity: 0.5;
}

#widget-pagination-container {
  display: grid;
  width: 100%;
  align-items: center;
  justify-items: center;
  margin: 2rem 0;
  grid-column: 1 / -1;
}

#widget-pagination-container button {
  border: solid var(--input-accent-color) 1px;
  color: var(--input-accent-color);
  background: transparent;
  outline: 0;
  padding: 0.5rem;
  width: 100%;
  max-width: 23.75rem;
  opacity: 1;
  cursor: pointer;
}

#widget-pagination-container button:hover {
  opacity: 0.7;
}

@media only screen and (max-width:760px) {
  #widget-coming-up .eb-item {
    height: auto;
  }

  #widget-coming-up .content-front {
    position: static;
    display: block;
  }

  #widget-coming-up .item-image-inner {
    position: static;
    width: 100%;
    height: 200px;
  }

  #widget-coming-up .show-details {
    position: static;
    width: 100%;
    height: auto;
    padding-bottom: 10px;
  }

  #widget-coming-up .performing {
    padding-left: 0;
  }

  #widget-coming-up .buttons-outer {
    position: static;
  }

  #widget-coming-up .buttons-outer a,
  #widget-coming-up .buttons-outer .info-button {
    padding: 7px 0;
  }
}

@media (min-width: 760px) {
  #widget-search-controls-form {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) max-content;
  }
}

.eb-item {
  height: auto;
  display: grid;
  position: relative;
  border-radius: 2px;
  box-shadow: 2px 2px 5px 1px #0000007d;
}

/* EB */
@media screen and (max-width: 560px) {
  #widget-full-feed.empty-bottle .eb-item {
    width: 100%;
    margin-right: 0;
    margin-left: 0;
  }
}
/* End EB */

/* Thalia */
/* End Thalia */

.content-front {
  display: grid;
  position: relative;
  width:  100%;
  height: auto;
  text-align: left;
  grid-template-rows: max-content 1fr max-content;
  justify-content: stretch;
  align-items: start;
  z-index:  2;
  /* padding:  10px; */
}
.item-image-inner {
  height: 185px;
  width: 100%;
  background: center center;
  background-size: cover;
}
img.item-image-inner {
  display: none;
}
.content-back {
  position: absolute;
  top: 100%;
  left: 0%;
  background-color: rgb(255, 255, 255);
  width: 100%;
  height: 100%;
  text-align: left;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  z-index: 1;
}

.buttons-outer {
  display: flex;
  text-align: center;
  position: relative;
  width: 100%;
  flex-direction: row;
  align-self: end;
}

.show-details{
  background-color: rgb(255, 255, 255);
  display: flex;
  flex-direction: column;
  align-self: stretch;
  padding: 0 0 1rem;
  /* padding: 5%; */
}

.date {
  color: #272727;
  height: 15%;
}
.start-time {
  color: #636363;
  /* margin-bottom: 10px; */
  height: 15%;
}
.title {
    color: #272727;
    margin: 0px 10px 10px 10px;
}
.performing {
    list-style:  none;
    padding-left: 0;
    list-style-type: none;
    -webkit-margin-start: 0px;
    -webkit-margin-end: 0px;
    -webkit-padding-start: 0px;
    color: #272727;
    margin: 0px 10px 10px 10px;
}
.restrictions {
  color: #636363;
}
.title, .performing, .restrictions, .venue {
  margin-left: 10px;
}

.venue {
  flex-grow: 1;
  display: flex;
  align-items: end;
  line-height: 1;
  gap: 0.2rem;
  margin-top: 1rem;
  color: var(--input-text-color, #444);
}

.venue svg {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-bottom: 3px;
}

.venue svg path
{
  stroke: rgba(0, 0, 0, 0.87);
}

.date-time-outer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
}

.date, .start-time, .title, .performing, .restrictions, .info-button , .buy-button , .event-venue {/* justify-content:  center; *//* display:  flex; */}
.info-button , .buy-button {
  flex-direction: column;
  width: 100%;
  color:  whitesmoke;
  cursor:  pointer;
  text-transform: uppercase;
  justify-content: center;
  display:  flex;
}
a.buy-button , a.info-button {
  text-decoration:  none;
  padding: 0.5rem;
}
.content-back , .buttons-outer {

}
.info-button {
    background-color: #8e8781;
}
.buy-button {
    background-color: #231f20;
}
.buttons-outer {/* margin-top: 5%; */}

.event-venue {
  position: absolute;
  top: 0%;
  left: 0%;
  display: block;
  width:  100%;
  color: #9e2d2d;
  text-decoration: none;
  text-align:  center;
}

/* The magic sauce that moves the 'card' when you hover over it */
/* .eb-item:hover .content-front{
    height: 85%;
}
.eb-item:hover .content-back{
  top: 85%;
} */
.content-front.visible-description{
  top: -90%;
}
.content-back.visible-description {
  top: 0%;
}
/* .eb-item:hover .content-back.visible-description {
  top:0%;
}
.eb-item:hover .content-front.visible-description {
  height:100%;
} */

/* END The magic sauce that moves the 'card' when you hover over it */

.item-description a{
  text-decoration: none;
  color: #9e2d2d;
}
.item-description {
  display: block;
  overflow-y:  scroll;
  width: 90%;
  height: 85%;
  position: absolute;
  bottom: 0%;
  margin: 0% 5% 5% 5%;
}
.item-description p {
  word-wrap: break-word;
}

@font-face {
  font-family: 'BebasNeue';
  src: url('BebasNeue.otf');
}

.blur {
  background: center center;
  background-size: 1%;
}

/* START Thalia specific styling */

/*
Thalia Colors
lightgray
color: #8e8781;

Dark Grey
color: #231f20;

Burgundy
color: #5d071b
*/
.thalia .performing,
.salt-shed .performing{
  display: none;
}
.thalia .date , .thalia .restrictions , .thalia .start-time , .thalia .title , .thalia .buy-button , .thalia .info-button{
  font-family: "BebasNeue","bebas-neue", "bebas_neueregular", "DINPro", helvetica, sans-serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  font-size: 1em;
}

.thalia {
  --input-background-color: #fff;
  --content-background-color: #fff;
  --body-font-family: "BebasNeue","bebas-neue", "bebas_neueregular", "DINPro", helvetica, sans-serif;
  --input-font-family: "BebasNeue","bebas-neue", "bebas_neueregular", "DINPro", helvetica, sans-serif;
}

.thalia .buy-button:hover {
    background-color: #9e2d2d;
}

.thalia .info-button:hover {
    background-color: #9e2d2d;
}

.thalia .event-venue {
  background-color: #b48934;
  color: white;
}

.space .event-venue {
  background-color: #fff;
}

/* END Thalia specific styling */

/* START Empty Bottle specific styling */
.empty-bottle .date,
.empty-bottle .restrictions,
.empty-bottle .start-time,
.empty-bottle .buy-button,
.empty-bottle .info-button,
.empty-bottle .performing,
.empty-bottle .event-venue,
.empty-bottle-presents .date,
.empty-bottle-presents .restrictions,
.empty-bottle-presents .start-time,
.empty-bottle-presents .buy-button,
.empty-bottle-presents .info-button,
.empty-bottle-presents .performing,
.empty-bottle-presents .event-venue {
  font-family: Helvetica, Arial, sans-serif;
}

.empty-bottle {
  --input-background-color: #fff;
  --content-background-color: #fff;
  --body-font-family: Helvetica, Arial, sans-serif;
  --input-font-family: Helvetica, Arial, sans-serif;
}

.empty-bottle .eb-item,
.empty-bottle-presents .eb-item {
  box-shadow: 2px 2px 5px 1px #00000000;
}
.empty-bottle .show-details,
.empty-bottle-presents .show-details {
  background-color: #eaeaea;
}
.empty-bottle .content-back,
.empty-bottle-presents .content-back {
  background-color: #eaeaea;
}
.empty-bottle .title,
.empty-bottle-presents .title {
    display: none;
}

.empty-bottle .date,
.empty-bottle-presents .date {
  text-transform: uppercase;
  font-weight: bold;
  color: #272727;
}

.empty-bottle .start-time,
.empty-bottle-presents .start-time {
  /* font-size: small; */
  /* font-weight: bold; */
}

.empty-bottle .performing,
.empty-bottle-presents .performing {
  margin-top: 0px;
  margin-bottom: 0px;
  color: #6597aa;
  font-weight: bold;
  /* overflow: hidden; */
}

.empty-bottle .buy-button,
.empty-bottle .info-button,
.empty-bottle-presents .buy-button,
.empty-bottle-presents .info-button {
  font-weight: bold;
}

.empty-bottle .event-venue,
.empty-bottle-presents .event-venue {
  background-color: #9e2d2d;
  color: whitesmoke;
}

.empty-bottle .buy-button:hover,
.empty-bottle-presents .buy-button:hover {
    background-color: #6597aa;
}

.empty-bottle .info-button:hover,
.empty-bottle-presents .info-button:hover {
    background-color: #6597aa;
}

.empty-bottle .eb-item,
.empty-bottle-presents .eb-item {

}

/* END Empty Bottle specific styling */

/* START Space Bottle specific styling */

.space .date, .space .restrictions {
  color: #8e8781;
}

.space .date {
  text-transform: uppercase;
}

.space .title {
  color: #993d00;
}

.space .performing {
  display: none;
}

.space .buy-button:hover , .space .info-button:hover {
    background-color: #bb794f;
    color: white;
}

/* END Space specific styling */

.space-presents .performing {
  display: none;
}

/* START Promontory specific styling */
.promontory .performing {
  display: none;
}

.promontory .eb-item {
  height: auto;
}

.promontory .item-description {
  color: black;
  width: 90%;
}


/* START Salt Shed specific styling */
.salt-shed {
  --input-background-color: rgb(251, 246, 223);;
  --content-background-color: rgb(251, 246, 223);;
  --input-text-color: #2d3b97;
  --body-font-family: purista-web;
  --input-font-family: purista-web;
}

.salt-shed .eb-item {
  font-size: 1rem;
}

.salt-shed .eb-item .show-details {
  background-color: rgb(251, 246, 223);
}

.salt-shed .eb-item .content-back {
  background-color: #fbf6df;
  color: #2d3b97;
  font-size: 18px;
}

.salt-shed .eb-item .date,
.salt-shed .eb-item .start-time,
.salt-shed .eb-item .restrictions {
  color: #2d3b97;
  font-size: 15px;
  font-weight: 500;
}

.salt-shed .eb-item .title {
  font-family: purista-web;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 20px;
  color: #2d3b97;
  line-height: 1.2;
}

.salt-shed .eb-item .buy-button,
.salt-shed .eb-item .info-button{
  color: #2d3b97;
  font-family: purista-web;
  font-weight: 700;
  text-transform: uppercase;
}

.salt-shed .eb-item .buy-button {
  background-color: #9dbccb;
}

.salt-shed .eb-item .info-button {
  background-color: #F8D89E;
}

/* start Three Top Lounge styling */


.three-top .performing {
	display: none;
}

.three-top .eb-item {
  font-size: 1rem;
}

.three-top .eb-item .show-details {
  background-color: #fcf4e3;
}

.three-top .eb-item .content-back {
  background-color: #fcf4e3;
  color: #324756;
  font-size: 18px;
}

.three-top .eb-item .date,
.three-top .eb-item .start-time,
.three-top .eb-item .restrictions {
  color: #324756;
  font-size: 15px;
  font-weight: 600;
  font-family: brook;
}

.three-top .eb-item .title {
  font-family: brook;
  text-transform: uppercase;
  font-size: 20px;
  color: #324756;
  line-height: 1.2;
  font-weight: 600;
}

.three-top .eb-item .buy-button,
.three-top .eb-item .info-button{
  color: #fcf4e3;
  font-family: brook;
  font-weight: 600;
  text-transform: uppercase;
}

.three-top .eb-item .buy-button {
  background-color: #7a3634;
}

.three-top .eb-item .content-back,
.three-top .item-description {
  color: #333333;
  background-color: #fcf4e3;
  font-family: brook;
  font-weight: 600;
}

.three-top .eb-item .info-button {
  background-color: #333333;
}

  `;
  
  // Create and inject style element
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
  
  // Wait for jQuery to be available
  function waitForJQuery(callback) {
    if (typeof window.jQuery !== 'undefined') {
      callback();
    } else {
      setTimeout(function() {
        waitForJQuery(callback);
      }, 100);
    }
  }
  
  // Load jQuery first if not already present
  if (typeof window.jQuery === 'undefined') {
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://code.jquery.com/jquery-3.2.1.js';
    jqueryScript.onload = function() {
      loadRemainingScripts();
    };
    document.head.appendChild(jqueryScript);
  } else {
    loadRemainingScripts();
  }
  
  function loadRemainingScripts() {
    // Load Handlebars
    if (typeof window.Handlebars === 'undefined') {
      const handlebarsScript = document.createElement('script');
      handlebarsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.7.7/handlebars.min.js';
      handlebarsScript.onload = function() {
        loadMoment();
      };
      document.head.appendChild(handlebarsScript);
    } else {
      loadMoment();
    }
  }
  
  function loadMoment() {
    // Load Moment.js
    if (typeof window.moment === 'undefined') {
      const momentScript = document.createElement('script');
      momentScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min.js';
      momentScript.onload = function() {
        loadEventbriteWidget();
      };
      document.head.appendChild(momentScript);
    } else {
      loadEventbriteWidget();
    }
  }
  
  function loadEventbriteWidget() {
    // Load Eventbrite widget
    const ebScript = document.createElement('script');
    ebScript.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
    ebScript.onload = function() {
      initializeApp();
    };
    document.head.appendChild(ebScript);
  }
  
  function initializeApp() {
    // handlers.js content
    function handlers() {
      $('#info').on('click',function(){
        console.log("Clicked this:", $(this));
      })
    }
    handlers();

    window.showDescription = function(id) {
      $('#'+id+'-content-back').toggleClass("visible-description");
      $('#'+id+'-content-front').toggleClass("visible-description");
      if ($('#'+id+'-info').html() == "CLOSE") {
        $('#'+id+'-info').html("INFO")
      }else {
        $('#'+id+'-info').html("CLOSE")
      }
    }
    
    // generateItems.js content
    var $url;
    var venueID, token;
    var venue = $("#widget-full-feed").attr('class') || 'empty-bottle';
    var $localJSON = [];
    var tzOffset = '-05:00';

    window.formatMoney = function(amount) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
        amount
      );
    }

    window.humanize = function(slug) {
      var words = slug.split('-');

      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }

      return words.join(' ');
    }

    // Define fairgroundsShows array - add show titles that should appear at Fairgrounds
    window.fairgroundsShows = [
      "Brothers Osborne: Might As Well Be Us Tour",
      "The Postal Service & Death Cab For Cutie: Give Up & Transatlanticism",
    ];
    
    const venueIdMap = {
      thalia: ['rZ7HnEZ17aJq7', 'rZ7HnEZ17aJq0', 'KovZpZAktlaA'],
      space: ['KovZpakJQe', 'rZ7HnEZ173FQ4', 'rZ7HnEZ17fSA4'],
      'salt-shed': ['KovZ917AI5F', 'KovZ917Amf0','rZ7HnEZ17_Skd'], // Salt Shed and Fairgrounds venue IDs, Three Top Lounge
      'empty-bottle': [
        'KovZpZAId16A',
        'rZ7HnEZ178O8A',
        'rZ7HnEZ17a4Af',
        'KovZ917AEIJ',
        'KovZ917AEEX',
        'KovZpZAFJ1EA',
        'KovZpZAFEFAA',
        'KovZpaptBe',
        'KovZpaptYe',
        'KovZpZAkt67A',
        'KovZ917AEIJ',
        'rZ7HnEZaeir',
        'rZ7HnEZ178gfg',
        'rZ7HnEZ17bbPI'
      ]
    }

    function getSelectedVenueParams() {
      const targetVenues = (window.selectedVenues && window.selectedVenues.length)
        ? window.selectedVenues
        : Object.keys(venueIdMap);
      const venueIds = targetVenues.reduce(function(coll, venueName) {
        coll.push(...(venueIdMap[venueName]) ?? []);
        return coll;
      }, []).join(',');

      return `&venueId=${venueIds}`
    }

    function getSelectedGenreParams() {
      if (!window.selectedGenres || !window.selectedGenres.length) {
        return '';
      }

      return `&genreId=${window.selectedGenres.join(',')}`;
    }

    function getSelectedVenueNames() {
      if (!window.selectedVenues || !window.selectedVenues.length) {
        return 'All Venues';
      }

      return window.selectedVenues.map(humanize).join(', ');
    }


    function getSelectedGenreNames() {
      if (!window.selectedGenres || !window.selectedGenres.length) {
        return 'Any Genre';
      }

      return window.selectedGenres.map(function(genreId) {
        return window.genreOptions.find(function(opt) {
          return opt.value === genreId;
        }).label;
      }).join(', ');
    }

    function getSelectedDateParam() {
      if (window.selectedDate) {
        const d = moment(window.selectedDate);
        const start = d.startOf('day').toISOString().replace(/.\d+Z$/g, "Z");
        const end = d.endOf('day').toISOString().replace(/.\d+Z$/g, "Z");

        return `&startDateTime=${start}&endDateTime=${end}`;
      }

      return '';
    }

    function getSelectedPageParam() {
      const page = window.selectedPage ?? 0;
      return `&page=${page}`;
    }

    var orderCompleteCallback = function() {
      console.log("Order complete!");
    };

    function getGenres() {
      var apiUrl = 'https://app.ticketmaster.com/discovery/v2/classifications/%20KZFzniwnSyZfZ7v7nJ?apikey=8GdH3nQcFnnZkzWGuPSGkh9oIKUGjffQ&locale=*';
      return $.ajax(apiUrl).then(function(data) {
        window.genreOptions = data.segment._embedded.genres.map(function(genre) {
          return {
            label: genre.name,
            value: genre.id
          };
        });
        return window.genreOptions;
      });
    }

    // Load external script function
    function loadScript(url) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.getElementsByTagName('head')[0].appendChild(script);
        script.onload = function () {
          resolve(url);
        };
        script.onerror = function () {
          reject(url);
          console.log('Something went wrong!');
        };
      })
    }

    // events (local) api call
    window.getEvents = function() {
      var apiUrl = 'https://static2.16oncenterchicago.com/eventbrite/v2/json/' + venue + '.js';

      if (venue === 'empty-bottle-presents') {
        apiUrl = 'https://static2.16oncenterchicago.com/eventbrite/v2/json/empty-bottle.js';
      }
      if (venue === 'space-presents') {
        apiUrl = 'https://static2.16oncenterchicago.com/eventbrite/v2/json/space.js';
      }

      var tmEvents = []
      var tmUrl = '';
      var tmUrl2 = '';

      if (venue === 'thalia') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=Mj9g4ZY7tXTmixNb7zMOAP85WPGAfFL8&venueId=rZ7HnEZ17aJq7&venueId=rZ7HnEZ17aJq0&venueId=KovZpZAktlaA&source=ticketweb';
      } else if (venue === 'space') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=8GdH3nQcFnnZkzWGuPSGkh9oIKUGjffQ&venueId=KovZpakJQe&source=ticketmaster,ticketweb';
        tmUrl2 = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=8GdH3nQcFnnZkzWGuPSGkh9oIKUGjffQ&promoterId=6085';
      } else if (venue === 'salt-shed') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=VlcOb6C2Y4W0iGius6pFX1Gh7a9GnKyg&venueId=KovZ917AI5F';
        tmUrl2 = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=VlcOb6C2Y4W0iGius6pFX1Gh7a9GnKyg&venueId=KovZ917Amf0';
      } else if (venue === 'three-top') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=VlcOb6C2Y4W0iGius6pFX1Gh7a9GnKyg&venueId=rZ7HnEZ17_Skd';
      } else if (venue === 'empty-bottle') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=GmC9AB6l4pDhA5yhg4dgD3G0AEDK8wmL&venueId=rZ7HnEZ178gfg&venueId=KovZpZAId16A&venueId=rZ7HnEZ17aJ47&source=ticketmaster,ticketweb';
        tmUrl2 = 'https://app.ticketmaster.com/discovery/v2/events?apikey=GmC9AB6l4pDhA5yhg4dgD3G0AEDK8wmL&promoterId=6084';
      } else if (venue === 'promontory') {
        tmUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?size=200&apikey=YCX1KG7F2G6qU8yzFevLpPfV8FXtiF3u&venueId=rZ7HnEZ178Zp4';
      } else if (venue === 'all') {
        tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?&apikey=8GdH3nQcFnnZkzWGuPSGkh9oIKUGjffQ&${getSelectedVenueParams()}${getSelectedGenreParams()}${getSelectedDateParam()}&source=ticketmaster,ticketweb&sort=date,asc&size=8${getSelectedPageParam()}`;
      }

      let _loadScript;
      let _tm2Ajax;

      if (venue !== 'salt-shed' && venue !== 'three-top' && venue !== 'all') {
        _loadScript = loadScript(apiUrl);
      }

      if (tmUrl2 && (venue === 'salt-shed' || venue === 'space' || venue === 'empty-bottle')) {
        _tm2Ajax = $.ajax(tmUrl2);
      }

      $.when(
          _loadScript,
          $.ajax(tmUrl),
          _tm2Ajax
      ).then(function (eventbrite, ticketmaster, ticketmaster2) {
        tmEvents = []
        if (venue === 'thalia' || venue === 'space' || venue === 'salt-shed' || venue === 'three-top' || venue === 'empty-bottle' || venue === 'promontory' || venue === 'all') {
          var embedded = ticketmaster[0]._embedded;
          var events = (embedded || {}).events;

          if (ticketmaster2) {
            var embedded2 = ticketmaster2[0]._embedded;
            events = events.concat((embedded2 || {}).events || []);
          }

          tmEvents = (events || []).filter(function (r) {
            if (venue === 'thalia' || venue === 'space' || venue === 'salt-shed' || venue === 'three-top' || venue === 'empty-bottle' || venue === 'promontory' || venue === 'all') return r.dates.status.code !== 'cancelled';

            return (r.promoter || {}).id == 494 && r.dates.status.code !== 'cancelled'
          })
        }

        if (venue === 'space-presents' || venue === 'empty-bottle-presents') {
            window.totalPages = 0;
        }
        else {
            window.totalPages = ticketmaster[0].page.totalPages;
        }

        console.log(window.totalPages);

        var ebEvents = window.apiEvents || [];

        for (var i = 0; i < tmEvents.length; i++) {
          var duplicateEventIndex = ebEvents.findIndex(function (ebe) {
            return ebe.name.text === tmEvents[i].name;
          });

          if (duplicateEventIndex > -1) {
            ebEvents.splice(duplicateEventIndex, 1);
          }
        }

        $localJSON = parsedEvents($localJSON.concat(ebEvents, tmEvents));

        generateItems();
      });
    }


    // venue specific event parsing and sorting
    function parsedEvents(events) {
      var _parsedEvents = events;

      if (venue === 'space') {
        var spaceResults = [];
        for (var i = 0; i < events.length; i++) {
          if (events[i].source !== 'queue' || events[i].id === '60703504817') {
            spaceResults.push(events[i]);
          }
        }
        _parsedEvents = spaceResults;
      }

      if (venue === 'empty-bottle-presents') {
        var ebpResults = [];
        for (var i = 0; i < events.length; i++) {
          if (events[i].venue && (events[i].venue.name || {}) !== 'The Empty Bottle') {
            ebpResults.push(events[i]);
          }
        }
        _parsedEvents = ebpResults;
      }

      _parsedEvents.sort(function(a, b){
        aStart = ''
        if (a.hasOwnProperty('start')) aStart = a.start.local;
        else aStart = a.dates.start.dateTime

        bStart = ''
        if (b.hasOwnProperty('start')) bStart = b.start.local;
        else bStart = b.dates.start.dateTime

        return new Date(aStart) - new Date(bStart);
      });

      return _parsedEvents;
    }

    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };

    function setCardLinkTexts(cardData) {
      if (cardData.ticketmaster) {
        return [
          cardData.url,
          cardData.url,
          "Tickets"
        ];
      }

      if (cardData.isCancelled) {
        return [
          "https://eventbrite.com/e/"+cardData.id+"#tickets",
          "https://eventbrite.com/e/"+cardData.id,
          "cancelled"
        ];
      }

      if (cardData.isPostponed) {
        return [
          "https://eventbrite.com/e/"+cardData.id+"#tickets",
          "https://eventbrite.com/e/"+cardData.id,
          "postponed"
        ];
      }

      if (cardData.isSoldOut) {
        return [
          "https://eventbrite.com/e/"+cardData.id+"#tickets",
          "https://eventbrite.com/e/"+cardData.id,
          "sold out"
        ];
      }

      if (!cardData.hasAvailableTickets) {
        return [
          "https://eventbrite.com/e/"+cardData.id+"#tickets",
          "https://eventbrite.com/e/"+cardData.id,
          "soon"
        ];
      }

      if (cardData.isFree) {
        return [
          "https://eventbrite.com/e/"+cardData.id+"#tickets",
          "https://eventbrite.com/e/"+cardData.id,
          "free"
        ];
      }

      if (cardData.externallyTicketed) {
        return [
          cardData.external_ticketing.external_url,
          "https://eventbrite.com/e/"+cardData.id,
          "Tickets"
        ];
      }

      return [
        "https://eventbrite.com/e/"+cardData.id+"#tickets",
        "https://eventbrite.com/e/"+cardData.id,
        "Tickets"
      ];
    }

    function getNewEventImage(tmEvent) {
      // workaround for missing split image for guster & neko case show
      if (tmEvent.id === 'vvG18Z9lQ4IvZZ') {
        return 'https://static2.16oncenterchicago.com/eventbrite/v2/guster-neko-case.jpg';
      }

      var preferredImage;
      //ticketweb shows use ticketweb images; otherwise use 16_9 images
      if (tmEvent.url.includes("ticketweb")){
        preferredImage = tmEvent.images.find(function(i) {
          return !i.fallback && i.url.includes("ticketweb");
        });
      }
      else
        preferredImage = tmEvent.images.find(function(i) {
          return !i.fallback && i.ratio === "16_9" && i.width === 640;
      });

      if (preferredImage) {
        return preferredImage.url;
      }

      var nonFallback = tmEvent.images.filter(function(i) {
        return !i.fallback;
      });
      var largestNonFallback = nonFallback[0];
      for (var i = 0; i < nonFallback.length; i++) {
        if (nonFallback[i].width > largestNonFallback.width) {
          largestNonFallback = nonFallback[i];
        }
      }

      if (largestNonFallback) {
        return largestNonFallback.url;
      }

      // final fallback: stock image
      return tmEvent.images.find(function(i) {
        return i.ratio === "16_9" && i.width === 640;
      });
    }

    function parseNewEvent(event) {
      var _start = new Date(event.dates.start.dateTime)
      var _start_moment = moment(_start.toLocaleString('en-US', { timeZone: 'America/Chicago' }))

      var item = {
        id: event.id,
        ticketmaster: true,
        url: event.url,
        isSoldOut: false,
        isCancelled: false,
        isPostponed: false,
        hasAvailableTickets: 'ticketmaster',
        isFree: false,
        externallyTicketed: false,
        start: _start_moment.format('YYYY-MM-DDTHH:mm:ss'),
        ageRestriction: (event.ageRestrictions || {}).ageRuleDescription,
        venueName: event._embedded.venues[0].name,
        title: event.name,
        venueAddress: event._embedded.venues[0].address,
        ticketAvailability: '',
        support: '',
        presents: '',
        description: '', // maybe under event.classifications
        logo: true,
        image1: getNewEventImage(event),
        image2: getNewEventImage(event),
        pleaseNote: event.pleaseNote
      }

      if (event.info) {
        item.description += event.info
      }

      var doorsDt;
      if (event.doorsTimes) doorsDt = event.doorsTimes.dateTime;  // TM
      if ((event.dates || {}).access) doorsDt = event.dates.access.startDateTime;  // ticketweb

      if (doorsDt) {
        item.doors = new Date(doorsDt).toLocaleString('en-US', {timeZone: 'America/Chicago', hour: 'numeric', minute: 'numeric'})
      }

      return item;
    }


    function parseOldEvent(event) {
      var item = {
        id: event.id,
        isSoldOut: event.ticket_availability.is_sold_out,
        isCancelled: (event.event_sales_status || {}).message_code === 'event_cancelled',
        isPostponed: (event.event_sales_status || {}).message_code === 'event_postponed',
        hasAvailableTickets: event.ticket_availability.has_available_tickets,
        isFree: event.is_free,
        externallyTicketed: event.inventory_type === 'externally_ticketed',
        external_ticketing: event.external_ticketing,
        start: event.start.local,
        ageRestriction: event.music_properties.age_restriction,
        venueName: event.venue.name,
        title: event.name.html,
        venueAddress: event.venue.address.localized_address_display,
        ticketAvailability: event.ticket_availability,
        support: event.support,
        presents: event.music_properties.presented_by,
        description: event.description.html,
        logo: event.logo,
      }

      if (event.logo) {
        item.image1 = event.logo.original.url
        item.image2 = event.logo.url
      }

      if (event.music_properties.door_time) {
        item.doors = new Date(event.music_properties.door_time).toLocaleString('en-US', {timeZone: 'America/Chicago', hour: 'numeric', minute: 'numeric'});
      }

      return item;
    }

    function normalizeItemTemplateData(itemSource) {
      let item;
      if (
        itemSource.url.indexOf('ticketmaster') > -1
        || itemSource.url.indexOf('ticketweb') > -1
      ) {
        item = parseNewEvent(itemSource)
      } else {
        item = parseOldEvent(itemSource)
      }

      // parsing different words depending on the ticket status in Eventbrite
      var ticket_link = undefined;
      var info_link = undefined;
      var buy_button = undefined;

      var linkTexts = setCardLinkTexts(item);
      ticket_link = linkTexts[0];
      info_link = linkTexts[1];
      buy_button = linkTexts[2];

      var info_text = 'INFO';
      if (venue === 'salt-shed') {
        info_text = 'SHED';

        // Check if venue name contains "Fairgrounds" or if it's in the fairgroundsShows list
        if (item.venueName && item.venueName.toLowerCase().includes('fairgrounds')) {
          info_text = 'FAIRGROUNDS';
        } else if (typeof fairgroundsShows !== 'undefined' ) {
          if (fairgroundsShows.includes(item.title)) {
            info_text = 'FAIRGROUNDS';
          }
        }
      }

      // Removing age for empty bottle
      var parsed_restrictions;
      if (venue == 'empty-bottle' || venue == 'three-top'){
        parsed_restrictions = '';
        parsed_start = moment(item.start).format("h:mmA");
      } else {
        parsed_restrictions = item.ageRestriction;
        if (parsed_restrictions === 'all_ages') { parsed_restrictions = 'ALL AGES'; }
        if (parsed_restrictions === 'under_18_with_guardian') { parsed_restrictions = 'UNDER 18 WITH GUARDIAN'; }
        if (parsed_restrictions === 'under_21_with_guardian') { parsed_restrictions = 'UNDER 21 WITH GUARDIAN'; }
        parsed_start = "Doors: "+moment(item.start).format("h:mmA");

        if (item.doors) {
          parsed_start = "Doors: " + item.doors.replace(' ', '');
        } else {
          parsed_start = "Doors: "+moment(item.start).format("h:mmA");
        }
      }

      // Checking venue against venue_name
      var parsed_venue = undefined;
      var venue_name = item.venueName;

      if (venue_name != 'The Empty Bottle' && venue_name != 'Empty Bottle' && venue == 'empty-bottle') {
        parsed_venue = venue_name;
      }
      if (venue_name != 'The Empty Bottle' && venue == 'empty-bottle-presents') {
        parsed_venue = venue_name;
      }
      if (venue_name != 'Thalia Hall' && venue == 'thalia') {
        parsed_venue = venue_name;
      }
      if (venue_name != 'SPACE' && venue == 'space') {
        parsed_venue = venue_name;
      }

      let priceRange = "";
      if (itemSource.priceRanges) {
        const allPrices = itemSource.priceRanges.reduce((coll, price) => {
          coll.push(price.max);
          coll.push(price.min);
          return coll;
        }, []);

        const low = formatMoney(Math.min(...allPrices));
        const high = formatMoney(Math.max(...allPrices));

        if (low !== high) {
          priceRange = `${low} - ${high}`;
        } else {
          priceRange = `${high}`;
        }
      }

      var descriptionAndNote = [item.description, item.pleaseNote && `<b>Please Note:</b><br />${item.pleaseNote}`].filter(x => x).join('<br /><br />');

      // END Checking venue against venue_name
      var data = {
        "performing": [],
        "title": item.title,
        "date": moment(item.start,"YYYY-MM-DD").format("ddd MMMM D"),
        "month": moment(item.start,"YYYY-MM-DD").format("MMMM"),
        "support": item.support,
        "startTime": parsed_start,
        "venue": parsed_venue,
        "venue_address": item.venueAddress,
        "venueName": item.venueName,
        "ticket_availability": item.ticketAvailability,
        "restrictions": parsed_restrictions,
        "presents": item.presents,
        "eventbrite_id": item.eventbrite_id,
        "ticket_link": ticket_link,
        "info_link": info_link,
        "info_text": info_text,
        "buy_button": buy_button,
        "description": descriptionAndNote,
        "pleaseNote": item.pleaseNote,
        "hasEmbeddedCheckout": venue === 'thalia' && item.externallyTicketed,
        "price": priceRange,
        "_rawItem": itemSource
      };

      if (item.id === '423711280847') {
        data.hasEmbeddedCheckout = false;
      }

      var title = item.title;

      // Initialize performing array
      data.performing = [];

      if (item.presents) {
        // If there's a presenter, add it first
        data.performing.push(item.presents);
        // Then parse the artists from the title
        var artistsOnly = title.split('@')[0];
        // Remove the presenter part if it exists in the title
        if (artistsOnly.toLowerCase().includes('presents')) {
          artistsOnly = artistsOnly.split(/presents/i).slice(1).join('presents');
        }
        // Split by forward slash for multiple artists
        var parsedArtists = artistsOnly.split('/').map(function(artist) {
          return artist.trim();
        }).filter(function(artist) {
          return artist.length > 0;
        });
        data.performing = data.performing.concat(parsedArtists);
      } else {
        // Check if title contains "presents"
        var presents = title.split(/presents/i);
        if (presents.length > 1) {
          // Add presenter
          data.performing.push(presents[0].trim() + ' presents');
          // Get the artists after "presents"
          var performingString = presents.slice(1).join('presents').split('@')[0];
          var artists = performingString.split('/').map(function(artist) {
            return artist.trim();
          }).filter(function(artist) {
            return artist.length > 0;
          });
          data.performing = data.performing.concat(artists);
        } else {
          // No presenter, just parse artists directly
          var performingString = title.split('@')[0];
          var artists = performingString.split('/').map(function(artist) {
            return artist.trim();
          }).filter(function(artist) {
            return artist.length > 0;
          });
          data.performing = artists;
        }
      }

      data.title = data.title.split('@')[0];

      if (!data.performing || data.performing.length === 0) {
        data.performing = undefined;
      }

      var today = moment().format("ddd MMM D");
      var showDate = moment(item.start, "YYYY-MM-DD").format("ddd MMM D");
      var showDateIsToday = showDate === today;

      data.showDateIsToday = showDateIsToday;

      if (item.logo) {
        if (showDateIsToday) {
          data.imageLink = item.image1;
        } else {
          data.imageLink = item.image2;
        }
      }

      return data;
    }

    function normalizeTextForComparison(text) {
      return (text || '')
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&(amp|#38);/gi, '&')
        .replace(/&(ndash|mdash);/gi, '-')
        .replace(/&#(8211|8212|x2013|x2014);/gi, '-')
        .replace(/[–—]/g, '-')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    }

    function dedupeAllVenuePerformers($items) {
      if (venue !== 'all') {
        return;
      }

      ($items || $('#widget-full-feed .eb-item')).each(function() {
        var $item = $(this);
        var $title = $item.find('.title');
        if ($title.length === 0) {
          return;
        }

        var titleText = normalizeTextForComparison($title.text());
        if (!titleText) {
          return;
        }

        var $performingList = $item.find('.performing');
        if ($performingList.length === 0) {
          return;
        }

        var performerTexts = $performingList.find('li').map(function() {
          return normalizeTextForComparison($(this).text());
        }).get().filter(function(text) {
          return text.length > 0;
        });

        if (performerTexts.length === 0) {
          $performingList.remove();
          return;
        }

        var titleContinuous = titleText.replace(/[^a-z0-9]/g, '');
        var performersContinuous = performerTexts.join(' ').replace(/[^a-z0-9]/g, '');

        var allContained = performerTexts.every(function(perf) {
          var perfContinuous = perf.replace(/[^a-z0-9]/g, '');
          return perfContinuous && titleContinuous.indexOf(perfContinuous) !== -1;
        });

        if (
          (titleContinuous && performersContinuous && titleContinuous === performersContinuous) ||
          allContained
        ) {
          $performingList.remove();
        }
      });
    }

    window.generateItems = function(getAll) {
      getAll = getAll || false;
      $('#widget-coming-up').html('');
      $('#widget-full-feed').html('');
      var targetDiv = document.getElementById('widget-full-feed');

      if ($localJSON == undefined) {
        console.log('$localJSON is undefined, so Im running getFeed again');
      } else {
        if ($localJSON.length === 0) {
          const notFoundTemplateRenderer = Handlebars.compile(notFoundTemplate);
          const notFoundResult = notFoundTemplateRenderer({});
          $(targetDiv).append(notFoundResult);
        }

        for (var i = 0; i < $localJSON.length; i++) {
          var item = $localJSON[i];
          if (item.url.indexOf('ticketmaster') === -1 && item.url.indexOf('ticketweb') === -1 && !item.listed) continue;
          const data = normalizeItemTemplateData(item);

          // Handle both Ticketmaster and Eventbrite venue formats
          const rawItem = data._rawItem;
          data.venueName = rawItem?._embedded?.venues?.[0]?.name || data.venueName;

          // For Ticketmaster events, use the structured address
          if (rawItem?._embedded?.venues?.[0]) {
            data.venueQuery = [
              rawItem._embedded.venues[0].address?.line1,
              rawItem._embedded.venues[0].city?.name,
              rawItem._embedded.venues[0].state?.stateCode
            ].filter(x => x).join(' ');
          } 
          // For Eventbrite events, use the venueAddress field
          else if (data.venue_address) {
            data.venueQuery = data.venue_address;
          }
          
          data.venueMapLink = data.venueQuery
            ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.venueQuery)}`
            : null;
          
          // Debug: Check Cahn Auditorium events
          if (data.venueName === 'Cahn Auditorium') {
            console.log('Cahn Auditorium event:', data.title, {
              venueName: data.venueName,
              venueQuery: data.venueQuery,
              venueMapLink: data.venueMapLink,
              venue: data.venue
            });
          }

          var rawSource = '<div class="eb-item" id="item-'+i+'" month="{{month}}">'+
              '<div class="content-front" id="item-'+i+'-content-front">'+
                '<div class="item-image-inner" id="item-image-full-'+i+'" style="background-image:url({{imageLink}});">'+'</div>'+
                '{{#if venue}}'+
                  '<a class="event-venue">At: {{venue}}</a>'+
                '{{/if}}'+
                '<div class="show-details">'+
                  '<div class="date-time-outer">'+
                    '<div class="date" id="item-'+i+'-date">{{{date}}}</div>'+
                    '<div class="start-time" id="item-'+i+'-start-time">{{startTime}}</div>'+
                  '</div>'+ // End date-time-outer
                  '<ul class="performing" id="item-'+i+'-performing">{{#each performing}}<li>{{{this}}}</li>{{/each}}</ul>'+
                  '<div class="title" id="item-'+i+'-title">'+
                    '{{{title}}}'+
                  '</div>'+
                  '<div class="restrictions" id="item-'+i+'-restrictions">{{restrictions}}</div>'+
                  '{{#if venueName}}'+
                    '<br />'+
                    '{{#if venueMapLink}}'+
                      '<a href="{{venueMapLink}}" target="_blank" class="venue" id="item-'+i+'-venue">'+
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">'+
                          '<path d="M17.5 8.33325C17.5 14.1666 10 19.1666 10 19.1666C10 19.1666 2.5 14.1666 2.5 8.33325C2.5 6.34413 3.29018 4.43647 4.6967 3.02995C6.10322 1.62343 8.01088 0.833252 10 0.833252C11.9891 0.833252 13.8968 1.62343 15.3033 3.02995C16.7098 4.43647 17.5 6.34413 17.5 8.33325Z" stroke="#292A33" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'+
                          '<path d="M10 10.8333C11.3807 10.8333 12.5 9.71396 12.5 8.33325C12.5 6.95254 11.3807 5.83325 10 5.83325C8.61929 5.83325 7.5 6.95254 7.5 8.33325C7.5 9.71396 8.61929 10.8333 10 10.8333Z" stroke="#292A33" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'+
                        '</svg>'+
                        '{{venueName}}'+
                      '</a>'+
                    '{{else}}'+
                      '<div class="venue" id="item-'+i+'-venue">{{venueName}}</div>'+
                    '{{/if}}'+
                  '{{/if}}'+
                '</div>'+ //End show-details
                '<div class="buttons-outer">'+
                  '{{#if buy_button}}'+
                    '{{#if hasEmbeddedCheckout}}'+
                      '<span'+
                        'id="buy-button-{{id}}"'+
                        'class="buy-button"'+
                        'href="{{ticket_link}}"'+
                        'target="_blank"'+
                        'alt="Buy {{title}} tickets on Eventbrite!"'+
                      '>'+
                        'GET {{buy_button}}'+
                      '</span>'+
                    '{{else}}'+
                      '<a class="buy-button" href="{{ticket_link}}" target="_blank" alt="Buy {{title}} tickets on Eventbrite!">'+
                        'GET {{buy_button}}'+
                      '</a>'+
                    '{{/if}}'+
                  '{{/if}}'+
                  '{{#if info_link}}<div class="info-button" id="item-'+i+'-info" onclick="showEventTicketsModal('+i+');" alt="Click for more info about {{title}} at {{venue}}">{{info_text}}</div>{{/if}}'+
                '</div>'+ //End buttons-outer
              '</div>'+ //End content-front
            '</div>'; // End eb-item
          var template = Handlebars.compile(rawSource);
          var $result = $(template(data));
          var todayStamp = moment().format("YYYYMMDDHHmmss");
          var showDateStamp = moment(item.start,"YYYY-MM-DD").format("YYYYMMDDHHmmss");

          if (data.showDateIsToday && !getAll && venue !== 'all') {
            $("#widget-coming-up").append($result);
          } else if (showDateStamp > todayStamp){
            $(targetDiv).append($result);
          }

          dedupeAllVenuePerformers($result);

          if (data.hasEmbeddedCheckout) {
            window.EBWidgets.createWidget({
              widgetType: 'checkout',
              eventId: item.id,
              modal: true,
              modalTriggerElementId: 'buy-button-' + item.id,
              onOrderComplete: orderCompleteCallback
            });
          }
        } // End loop
      }

      if ((window.selectedPage ?? 0) < window.totalPages - 1) {
        $(targetDiv).append(`
          <div id="widget-pagination-container">
            <button onclick="getNextPage()">Load More</button>
          </div>
        `)
      }
    } // End generateItems

    var infoTicketsTemplate = `
      <div id="widget-event-modal-container">
        <div id="widget-event-modal-overlay" onclick="closeEventModal()"></div>
        <div id="widget-event-modal-content">
          <div id="widget-event-modal-dialog">
            <div id="widget-event-modal-close" onclick="closeEventModal()"></div>
            <h5 id="widget-event-modal-date">{{date}}</h5>
            <h4 id="widget-event-modal-title">{{{title}}}</h4>

            {{#if imageLink}}
              <img src="{{ imageLink }}" />
            {{/if}}

            <table>
              <tbody>
                {{#if price}}
                  <tr>
                    <td>Price</td>
                    <td>{{ price }}</td>
                  </tr>
                {{/if}}
                {{#if startTime}}
                  <tr>
                    <td>Start</td>
                    <td>{{startTime}}</td>
                  </tr>
                {{/if}}
                {{#if restrictions}}
                  <tr>
                    <td>Age</td>
                    <td>{{restrictions}}</td>
                  </tr>
                {{/if}}
              </tbody>
            </table>

            {{#if description}}
              <div id="widget-event-modal-artist-bio">
                {{{description}}}
              </div>
            {{/if}}

            {{#if buy_button}}
              {{#if hasEmbeddedCheckout}}
                <span
                  id="buy-button-{{id}}"
                  class="buy-button"
                  href="{{ticket_link}}"
                  target="_blank"
                  alt="Buy {{title}} tickets on Eventbrite!"
                >
                  GET {{buy_button}}
                </span>
              {{else}}
                <a class="buy-button" href="{{ticket_link}}" target="_blank" alt="Buy {{title}} tickets on Eventbrite!">
                  GET {{buy_button}}
                </a>
              {{/if}}
            {{/if}}
          </div>
        </div>
      </div>
    `;

    var infoModalTemplate = `
      <div id="widget-event-modal-container">
        <div id="widget-event-modal-overlay" onclick="closeEventModal()"></div>
        <div id="widget-event-modal-content">
          <div id="widget-event-modal-dialog" class="info">
            <div id="widget-event-modal-close" onclick="closeEventModal()"></div>
            <h3 id="widget-event-modal-heading">INFO</h3>
            <h4 id="widget-event-modal-title">{{title}}</h4>
            <div id="widget-event-modal-date">{{date}}</div>
            <div id="widget-event-modal-start-time">{{startTime}}</div>
            <br />
            <div id="widget-event-modal-info">{{{pleaseNote}}}</div>
          </div>
        </div>
      </div>
    `;

    function showEventModal(itemIndex, modalTemplate) {
      const item = $localJSON[itemIndex];
      const data = normalizeItemTemplateData(item);
      const template = Handlebars.compile(modalTemplate);
      const modalContent = template(data);

      $('body')
        .css('overflow-y', 'hidden')
        .append(modalContent)
        .ready(function() {
          const $el = $('#widget-event-modal-container');
          $el.css('opacity', 1);
        });
      ;
    }

    window.showEventInfoModal = function(itemIndex) {
      showEventModal(itemIndex, infoModalTemplate);
    }

    window.showEventTicketsModal = function(itemIndex) {
      showEventModal(itemIndex, infoTicketsTemplate);
    }

    window.closeEventModal = function() {
      const seconds = 0.3;
      const $el = $('#widget-event-modal-container');
      $el.css('opacity', 0);
      $('body').css('overflow-y', 'auto');
      setTimeout(function() {
        $el.remove();
      }, seconds * 1000);
    }

    const notFoundTemplate = `
      <h3 class="widget-search-empty-results-set">No events found matching these filters</h3>
    `;

    const searchContolTemplate = `
      <div id="widget-search-controls-container">
        <h3 id="widget-search-controls-title">Upcoming Events</h3>
        <form id="widget-search-controls-form" onSubmit="return handleEventFilterUpdate()">
          <div class="widget-search-venue-multiselect search-control-container">
            <div id="widget-search-venue-filter-selection" class="search-control">
              <span id="widget-search-venue-filter-label">{{ venueSelectionLabel }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g opacity="0.6">
                  <path d="M17.5 8.33331C17.5 14.1666 10 19.1666 10 19.1666C10 19.1666 2.5 14.1666 2.5 8.33331C2.5 6.34419 3.29018 4.43653 4.6967 3.03001C6.10322 1.62349 8.01088 0.833313 10 0.833313C11.9891 0.833313 13.8968 1.62349 15.3033 3.03001C16.7098 4.43653 17.5 6.34419 17.5 8.33331Z" stroke="#292A33" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 10.8333C11.3807 10.8333 12.5 9.71402 12.5 8.33331C12.5 6.9526 11.3807 5.83331 10 5.83331C8.61929 5.83331 7.5 6.9526 7.5 8.33331C7.5 9.71402 8.61929 10.8333 10 10.8333Z" stroke="#292A33" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
              </svg>
            </div>
            <div id="widget-search-venue-filter" class="widget-checkbox-group">
              {{#each venueOptions}}
                <label>
                  <span><input name="venues" type="checkbox" value="{{ value }}" /></span>
                  <span>{{ label }}</span>
                </label>
              {{/each}}
            </div>
          </div>

          <input id="widget-search-event-date" class="search-control" type="date" name="date" min="{{ today }}" />

          <div class="widget-search-genre-multiselect search-control-container">
            <div id="widget-search-genre-filter-selection" class="search-control">
              <span id="widget-search-genre-filter-label">{{ genreSelectionLabel }}</span>
              <svg fill="rgba(0, 0, 0, 0.5)" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#000000" stroke-width="0.00512"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="5.12"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M503.319,5.939c-5.506-4.705-12.783-6.767-19.958-5.635L169.555,49.852c-12.04,1.901-20.909,12.28-20.909,24.47v99.097 v156.903H99.097C44.455,330.323,0,371.073,0,421.161C0,471.25,44.455,512,99.097,512c54.642,0,99.097-40.75,99.097-90.839v-66.065 V194.588l264.258-41.725v136.169h-49.548c-54.642,0-99.097,40.75-99.097,90.839s44.455,90.839,99.097,90.839 S512,429.959,512,379.871v-66.065V123.871V24.774C512,17.529,508.827,10.646,503.319,5.939z"></path> </g> </g> </g></svg>
    </div>
            <div id="widget-search-genre-filter" class="widget-checkbox-group">
              {{#each genreOptions}}
                <label>
                  <span><input name="genres" type="checkbox" value="{{ value }}" /></span>
                  <span>{{ label }}</span></label>
              {{/each}}
            </div>
          </div>

          <button id="widget-clear-filter-button" onclick="clearEventFilters()">Clear Filters</button>
        </form>
      </div>
    `;

    function initSearchControls() {
      const template = Handlebars.compile(searchContolTemplate);

      const venueOptions = Object.keys(venueIdMap).map(function(name) {
        return {
          label: humanize(name),
          value: name
        };
      });

      const formHtml = template({
        venueOptions: venueOptions,
        venueSelectionLabel: getSelectedVenueNames(),
        genreOptions: window.genreOptions,
        genreSelectionLabel: getSelectedGenreNames(),
        today: moment().format('YYYY-MM-DD').toString()
      });

      $('#widget-search-controls')
        .html(formHtml)
        .ready(function() {
          $('#widget-search-venue-filter, #widget-search-event-date, #widget-search-genre-filter').on('change', function() {
            $('#widget-search-controls-form').submit();
            $('#widget-search-venue-filter-label').html(getSelectedVenueNames());
            $('#widget-search-genre-filter-label').html(getSelectedGenreNames());
          });

          $('.search-control-container').click(function() {
            const $this = $(this);
            $this.addClass('active');
            $this.find('.search-control').addClass('active');

            $(document).on('click', function(event) {
              if (!$this.is(event.target) && $this.has(event.target).length === 0) {
                $this.find('.search-control').removeClass('active');
                $this.removeClass('active');
              }
            });
          });

        });
    }

    window.getNextPage = function() {
      const currentPage = window.selectedPage ?? 0;
      const nextPage = currentPage + 1;
      window.selectedPage = nextPage;

      getEvents();
    }

    window.clearEventFilters = function() {
      window.selectedVenues = undefined;
      window.selectedGenres = undefined;
      window.selectedDate = undefined;
      window.selectedPage = 0;

      // reset event list
      $localJSON = [];

      // reload events
      getEvents();

      // clear form selections
      initSearchControls();

      return false;
    }

    window.handleEventFilterUpdate = function() {
      const formData = new FormData(document.querySelector('#widget-search-controls-form'));

      window.selectedVenues = formData.getAll('venues');
      window.selectedGenres = formData.getAll('genres');
      window.selectedDate = formData.get('date');
      window.selectedPage = 0;

      // reset event list
      $localJSON = [];

      // reload events
      getEvents();

      return false;
    }

    // Initialize the app
    loadScript('https://www.eventbrite.com/static/widgets/eb_widgets.js').then(function(){
      getGenres().then(initSearchControls);
      getEvents();
    });
  }
})();
