
const styles = `
/**
 * DOCUMENTATION

This template is programmed according to mobile-first methodology (no media query = mobile version)

The organization is roughly as following :
0. template's CSS variables
1. first-level containers layout rules, for mobile, then tablet, then desktop version
2. reused components rules
3. view-specific rules

Used breakpoints
- tablet : 768px;
- desktop: 1224px;
 */
/**
 * =================
 * =================
 * =================
 * Default variables
 * =================
 * =================
 * =================
 */
:root 
{
  --aside-toggle-width: 2rem;
  --mobile-nav-head-height: 2rem;

  --transition-medium: 1000ms;

  --tablet-main-width: 75%;

  --color-background: #ffffff;
  --color-link-default: #99B6BD;/* bleu délavé */
  --color-link-active:#D4613E;/* rouille */
  --color-text: #4d4c4c;

  --desktop-nav-width: 16%;
  --desktop-aside-width: 20%;

  --content-margin-width: 20vw;

  --gutter-medium: 1rem;
  --gutter-large: 2rem;

  font-size: 18px;
}

@media screen and (min-width: 1224px){
  :root{
    font-size: 15px;
  }
}

/**
 * =================
 * =================
 * =================
 * Resets
 * =================
 * =================
 * =================
 */
button{
  background: inherit;
  border: none;
  outline: none;
  cursor: pointer;
}

/**
 * =================
 * =================
 * =================
 * Register animated elements here
 * =================
 * =================
 * =================
 */
.deucalion-layout .nav,
.deucalion-layout .nav-content-container,
.deucalion-layout .aside,
.deucalion-layout .aside-toggle,
.deucalion-layout .nav-toggle-symbol,
.deucalion-layout .main-container
{
  transition: all ease var(--transition-medium);
}

/**
 * =================
 * =================
 * =================
 * Global layout, mobile version
 * =================
 * =================
 * =================
 */

/**
 * Nav mobile layout
 */
.deucalion-layout .nav{
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  min-height: var(--mobile-nav-head-height);
  max-height: var(--mobile-nav-head-height);
  overflow: hidden;
}
.deucalion-layout .nav-header{
  min-height: var(--mobile-nav-head-height);
  max-height: var(--mobile-nav-head-height);
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  background: var(--color-background);
  align-items: center;
  margin-top: 0;

}
.deucalion-layout .nav-header .title {
  flex: 1;
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  /*align-items: center;*/
  justify-content: stretch;
}
.deucalion-layout .nav-header .title,
.deucalion-layout .nav-content-container{
  margin-left: calc(var(--content-margin-width) - var(--gutter-medium) * 2);  
}
.deucalion-layout .nav-header .title{
  margin-right: calc(var(--content-margin-width) - var(--gutter-medium) * 2);  

}
.deucalion-layout .nav-header .title .location-title{
  flex: 1;
}
.deucalion-layout .nav-content-container{
  overflow-y: auto;
  max-height: calc(100% - var(--mobile-nav-head-height) * 2);
  max-width: var(--tablet-main-width)
}

.deucalion-layout.has-index-open .nav{
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  background: var(--color-background);
}

.deucalion-layout .nav-header .nav-toggle {
  width: calc(var(--gutter-medium) * 2);
  justify-content: center;
  display: flex;
}


/**
 * Aside mobile layout
 */
.deucalion-layout .aside{
  position: fixed;
  top: var(--mobile-nav-head-height);
  left: calc(100% - var(--aside-toggle-width));
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  padding-left: var(--aside-toggle-width);
}
.deucalion-layout .aside.is-active{
  opacity: 1;
  pointer-events: all;
  background: var(--color-background);
}

.deucalion-layout .aside-toggle{
  position : absolute;
  left: 0;
  top: 0;
  width: var(--aside-toggle-width);
  height: 100%;
}

.deucalion-layout.has-aside-visible .aside{
  left: 0;
}

.deucalion-layout .railway{
  display: none;
}

/**
 * Main contents mobile layout
 */
.deucalion-layout .main-container{
  position: fixed;
  top: var(--mobile-nav-head-height);
  height: calc(100% - var(--mobile-nav-head-height));
  width: 100%;
  left: 0;
  box-sizing: border-box;
}

.deucalion-layout.has-aside-visible .main-container{
  left: -100%;
}

/*
.deucalion-layout .view-title{
  display: none;
}
*/

/**
 * =================
 * =================
 * =================
 * Global layout, tablet version
 * =================
 * =================
 * =================
 */
@media screen and (min-width: 768px) {
  /**
   * Aside tablet layout
   */
  .deucalion-layout .aside{
    left: var(--tablet-main-width);
    width: calc(100% - var(--tablet-main-width));
    height: 100%;
    
    padding-left: 0;
  }

  .deucalion-layout .aside-toggle{
    display: none;
  }

  .deucalion-layout.has-aside-visible .aside{
    left: var(--tablet-main-width);
    width: calc(100% - var(--tablet-main-width));
  }

  .deucalion-layout .railway{
    display: block;
  }
  /**
   * Main contents tablet layout
   */
  .deucalion-layout .main-container{
    width: 100%;
  }
  .deucalion-layout .main-contents-container,
  .deucalion-layout .navigation-footer{
    padding-right: calc(100% - var(--tablet-main-width));
  }

  .deucalion-layout.has-aside-visible .main-container{
    left: 0;
  }
}

/**
 * =================
 * =================
 * =================
 * Global layout, desktop version
 * =================
 * =================
 * =================
 */
@media screen and (min-width: 1224px) {
  /**
   * Nav desktop layout
   */
  .deucalion-layout .nav{
    position: fixed;
    width: var(--desktop-nav-width);
    top: 0;
    left: 0;
    height: 100%;
    min-height: unset;
    max-height: 100%;
    overflow: hidden;
    background: var(--color-background);
    padding: var(--gutter-medium);
    opacity: .5;
  }
  .deucalion-layout .nav:hover{
    opacity: 1;
  }
  .deucalion-layout .nav-header{
    max-height: unset;
  }
  .deucalion-layout .nav-header .title{
    height: unset;
    margin:0;
  }
  .deucalion-layout .nav-header .nav-toggle {
    display: none;
  }
  .deucalion-layout .nav-header .title,
  .deucalion-layout .nav-content-container
  {
    margin-left: 0;
  }

  .deucalion-layout .nav-header .title{
    font-size: 1.3rem;
    margin-bottom: var(--gutter-medium);
  }

  /* do not display location as it is always visible */
  .deucalion-layout .location-title{
    display: none;
  }

  /**
   * Aside desktop layout
   */
  .deucalion-layout .aside{
    position: fixed;
    top: 0;
    left: calc(100% - var(--desktop-aside-width));
    width: var(--desktop-aside-width);
    height: 100%;
  }
  .deucalion-layout .aside-toggle{
    display: none;
  }

  .deucalion-layout.has-aside-visible .aside{
    left: calc(100% - var(--desktop-aside-width));
    width: var(--desktop-aside-width);
  }

  /**
   * Main contents desktop layout
   */
  .deucalion-layout .main-container{
    position: fixed;
    top: 0;
    left: var(--desktop-nav-width);
    height: 100%;
    width: calc(100% - var(--desktop-nav-width));
    padding: var(--gutter-medium);
  }
  .deucalion-layout .view-title{
    display: block;
  }
  .deucalion-layout .main-contents-container,
  .deucalion-layout .navigation-footer{
    padding-right: calc(var(--desktop-aside-width) * 1.3);
  }

  .deucalion-layout.has-aside-visible .main-container{
    left: var(--desktop-nav-width);
  }
}

/**
 * =================
 * =================
 * =================
 * Global layout, print version
 * =================
 * =================
 * =================
 */
@media print {
  .deucalion-layout .nav,
  .deucalion-layout .aside,
  .navigation-footer{
    display: none;
  }
  .deucalion-layout .view-title{
    display: block;
  }
  .deucalion-layout .main-container{
    left: unset;
    top: unset;
    width: unset;
    height: unset;
    position: relative;
    overflow: visible;
  }
  /** scroll bars */
  .deucalion-layout .main-container > div,
  .deucalion-layout .main-container > div > div{
    left: unset;
    top: unset;
    width: unset;
    height: unset;
    position: relative;
    overflow: visible!important;
  }
  .deucalion-layout .main-container .main-column{
    padding: 1cm;
  }
}

/**
 * ======
 * ======
 * ======
 * ======
 * ======
 * END of global layout rules
 * ======
 * ======
 * ======
 * ======
 * ======
 */

/**
 * ======
 * Components styling
 * ======
 */
/**
 * GENERAL TYPOGRAPHY
 */
.deucalion-layout{
  text-rendering: optimizeLegibility;
  color: var(--color-text);
  font-family:'Source serif pro', serif;
}
.link,
a,
a:visited,
.inline-glossary
{
  color: var(--color-link-default);
  cursor: pointer;
  text-decoration: none;
}
.link.active,
.inline-glossary.active,
a:active{
  color: var(--color-link-active);
}

.deucalion-layout sup{
  font-size: .5em;
}
/**
 * GENERAL COMPONENTS
 */
/* bibliographic citations */
.csl-entry {
    word-break: break-all;
}

/* nav toggle */
.deucalion-layout .nav-header .nav-toggle {
  width: calc(var(--gutter-medium) * 2);
}
.deucalion-layout.has-index-open .nav-toggle-symbol{
  display: inline-block;
  transform: rotate(0deg);
}

.deucalion-layout.has-index-open .nav-toggle-symbol{
  transform: rotate(45deg);
}

/* aside toggle */
.deucalion-layout.has-aside-visible .aside-toggle{
  transform: rotate(180deg);
}

/* views title */
.view-title{
  margin-top: 0;
}

/* views main contents */
/** we always keep the same padding left for main column
even when notes are in the end*/
.main-contents-container .main-column {
  padding-left: var(--content-margin-width);
  padding-bottom: var(--gutter-medium);
}

/**
 * RENDERED CONTENT (ANYTHING COMING FROM DRAFT)
 */
.rendered-content p,
.rendered-content ul,
.rendered-content ol,
.rendered-content blockquote,
.rendered-content pre,
.rendered-content .unstyled
{
  margin-bottom: var(--gutter-medium);
  line-height: 1.4;
}

.rendered-content .unstyled:not(:first-of-type){
  text-indent : 2em;
}

.has-view-class-sections .main-column .rendered-content .unstyled:first-of-type::first-letter{
  font-size:3.5em;
  padding-right:0.2em;
  padding-bottom: 0;
  float:left;
}
h1{
    font-size: 1.5em;
    margin-bottom: .5em;
}

.rendered-content blockquote{
  margin: 0;
  padding: var(--gutter-medium);
  padding-left: var(--gutter-large);
  position: relative;
  background: rgba(0,0,0,0.03);
  quotes: '« ' ' »' '‹ ' ' ›';
}

/*
.note-item .rendered-content blockquote{
  padding: var(--gutter-small);
}
*/
.rendered-content blockquote:after
{
    position: absolute;
    right: 2px;
    bottom: 2px;

    content: close-quote;
}

.rendered-content blockquote:before
{
    position: absolute;
    top: 2px;
    left: 2px;
    content: open-quote;
}


/**
 * Figures (general)
 */
.block-contextualization-container,
.block-contextualization-container figure
{
  padding: 0;
  margin: 0;
}
.block-contextualization-container .figure-caption{
  /*border-top: 1px solid var(--color-link-default);*/
  padding-top: var(--gutter-medium);
}
.block-contextualization-container .figure-title{
  margin: 0;
}
.block-contextualization-container .figure-title .mention-context-pointer,
  .block-contextualization-container .figure-title button.mention-context-pointer{
  font-size: 1rem;
  font-family:'Source serif pro', serif;
  padding: 0;
  text-align: left;
}
.block-contextualization-container .figure-legend{
  font-size: 1em;
  margin-top: 0;
}
.block-contextualization-container .figure-legend p{
  margin-top: 0;
}
.block-contextualization-container figure{
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  position: relative;
}
.block-contextualization-container img
{
  max-width: 100%;
  max-height: 80vh;
  min-height: 40vh;
}
.block-contextualization-container iframe
{
  min-height: 50vh;
  outline: none;
  border: none;
  width: 100%;
  max-width: 100%;  
  height: 100%;
}
/**
 * Figures (specific)
 */
.block-contextualization-container.bib .figure-caption{
  display: none;
}
.block-contextualization-container.image img{
  cursor: pointer;
  transition: opacity ease var(--transition-medium);
}
.block-contextualization-container.image img:hover{
  opacity: .8;
}
.block-contextualization-container.image .image-nav-container{
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
}
.block-contextualization-container.image .image-nav-item{
  list-style-type: none;
  cursor: pointer;
}

.block-contextualization-container.image .image-nav-item-counter{
  display: none;
}

.block-contextualization-container.image .image-nav-item::after{
  content : "◉";
  color: var(--color-link-default);
}
.block-contextualization-container.image .image-nav-item.is-active::after{
  color: var(--color-link-active);
}

.block-contextualization-container.embed{
  min-height: 50vh;
  max-height: 80vh;
}

.block-contextualization-container.table{
  max-width: 100%;
  overflow: auto;
}
.block-contextualization-container.table table{
  max-width: 100%;
}

.block-contextualization-container.table .ReactTable .rt-tbody{
  max-height: 70vh;
  overflow: auto;
}

.block-contextualization-container.table .ReactTable
{
    max-width: 100%;
}

.block-contextualization-container.table .ReactTable .-pagination
{
    height: 5rem;
}

.block-contextualization-container.table table th {
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    text-align: left;
    font-weight: 400;
    text-indent: 0;
    font-size: .8em;
}

.block-contextualization-container.table table thead th {
  font-weight: 800;
}

.block-contextualization-container.vegaLite .vegaLite > div {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  padding: var(--gutter-medium);
}

/**
 * BIG LISTS (GLOSSARY, REFERENCES, ...)
 */
.big-list-items-container{
  padding: 0;
}
.big-list-item{
  margin: 0;
  list-style-type: none;
  margin-bottom: var(--gutter-medium);
}
.big-list-item h1,
.big-list-item h2,
.big-list-item h3
{
  margin: 0;
}

/**
 * NAV COMPONENTS STYLING
 */
.nav{
  margin-right: var(--gutter-medium);
  box-sizing: border-box;
}
.nav .nav-toggle,
.nav .title{
  height: var(--mobile-nav-head-height);
}


.nav .title > .link{
  display: none;
}

.has-index-open .nav .title > .link{
  display: block;
}
.nav .title .location-title{
  padding-left: 0;
  font-size: 1rem;
}
.has-index-open .location-title{
  display: none;
}

.nav .location-title{
  cursor: pointer;
  padding-left: var(--gutter-medium);
  text-transform: capitalize;
}
.nav-content-container ul{
  margin: 0;
  padding: 0;
  margin-top: var(--gutter-medium);
  padding-left: calc(var(--gutter-medium) * 2);
}
@media screen and (min-width: 1224px) {
  .nav{
    border: none;
  }
  .nav-content-container ul{
    padding-left: 0;
  }
  .nav .title > .link{
    display: block;
  }
}
.nav-content-container .nav-item{
  padding: 0;
  list-style-type: none;
}
.nav-content-container .nav-item.level-1{
  padding-left: calc(var(--gutter-medium) * .3);
}
.nav-content-container .nav-item.level-2{
  padding-left: calc(var(--gutter-medium) * .6);
}
.nav-content-container .nav-item.level-3{
  padding-left: calc(var(--gutter-medium) * 9);
}
.nav-content-container .nav-item.level-4{
  padding-left: calc(var(--gutter-medium) * 1.2);
}
.nav-content-container .nav-item.level-5{
  padding-left: calc(var(--gutter-medium) * 1.5);
}

@media screen and (min-width: 1224px){
  .nav-content-container .nav-item{
    font-size: .7rem;
  }
}

/**
 * ASIDE COMPONENT STYLING
 */
.aside .aside-content{
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
  width: calc(100% - var(--aside-toggle-width));
  padding: var(--gutter-medium);
  box-sizing: border-box;
  padding-top: 0;
  padding-right: 0;
  width: unset;
  max-width: 100%;
}
@media screen and (min-width: 1224px) {
  .aside .aside-content .aside-header{
    min-height: 2.5rem;
    align-items: flex-end;
  }
}
.aside .aside-header{
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: flex-start;
}

.aside .aside-header .aside-title{
  flex: 1;
  margin: 0;
}

.aside .aside-close-btn{
  font-size: 1em;
}

.aside .aside-body{
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.aside .aside-toggle{
  color: var(--color-link-default);
  background: transparent;
}

/**
 * RAILWAY COMPONENTS STYLING
 */
.deucalion-layout .railway{
  position: fixed;
  right: 2rem;
  top: 2rem;
  width: 1rem;
  height: calc(100% - 2rem);
}
.deucalion-layout .railway .elevator{
  position: absolute;
  left: 0;
  background: rgba(0,0,0,0.1);
  width: 100%;
  pointer-events: none;
}
.__react_component_tooltip{
  font-size: .5em;
}
.deucalion-layout .railway .shadow{
  position: absolute;
  left: 0;
  border: 1px solid lightgrey;
  width: 100%;
  cursor: pointer;
  box-sizing: border-box;
}
/**
 * LANDING VIEW COMPONENTS STYLING
 */
.deucalion-layout.has-view-class-landing .nav-header .title{
  display: none;
}
.landing-player .landing-title{
  font-size: 4rem;
  margin-bottom: 0;
}
.landing-player .landing-subtitle{
  font-size: 2rem;
  font-style: italic;
}

.landing-player .main-link{
  color: var(--color-link-active);
  font-size: 1.5rem;
}

.landing-player .links{
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}
.landing-player .links li{
  list-style-type: none;
  margin: 0;
}


/**
 * Pure CSS background Gradient
 * courtesy of Manuel Pinto -> https://codepen.io/P1N2O/pen/pyBNzX
 */
.deucalion-layout.has-view-class-landing .main-contents-container.has-animated-background-gradient{
  background: linear-gradient(-45deg, #EE7752, #E73C7E, #23A6D5, #23D5AB);
  background-size: 400% 400%;
  -webkit-animation: Gradient 15s ease infinite;
  -moz-animation: Gradient 15s ease infinite;
  animation: Gradient 15s ease infinite;

  min-height: 100%;
  color: var(--color-background);
}

.deucalion-layout.has-view-class-landing .main-contents-container.has-animated-background-gradient .link{
  color: var(--color-background);
}

@media screen and (min-width: 1224px){
  .deucalion-layout.has-view-class-landing .nav-content-container{
    margin-top: calc(2 * var(--gutter-medium));
    padding: var(--gutter-medium);
  }
  .deucalion-layout.has-view-class-landing .nav-header{
    display: none;
  }
  .deucalion-layout.has-view-class-landing .main-container{
    left: 0;
    width: 100%;
  }
  .deucalion-layout.has-view-class-landing .main-contents-container.with-animated-background{
    left: 0;
    padding-left: var(--desktop-nav-width);
  }
  .deucalion-layout.has-view-class-landing .nav{
    background: transparent;
  }
}
  

@-webkit-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@-moz-keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}

@keyframes Gradient {
  0% {
    background-position: 0% 50%
  }
  50% {
    background-position: 100% 50%
  }
  100% {
    background-position: 0% 50%
  }
}


/**
 * SECTION VIEW COMPONENTS STYLING
 */
.section-player{
  min-height: calc(100% - var(--gutter-medium) * 5);
  padding-bottom: calc(var(--gutter-medium) * 5);
  position: relative;
}
.main-contents-container{
  overflow-x: hidden;
}

/**
 * Notes can be displayed as sidenotes starting from tablet
 */
@media screen and (min-width: 768px) {
  .section-player.has-notes-position-sidenotes .notes-container{
    width: var(--content-margin-width);
    position: absolute;
    left: 0;
    height: 100%;
    top: 0;
    box-sizing: border-box;
    padding-right: var(--gutter-medium);
    padding-left: var(--gutter-medium);
    font-size: .7em;
    opacity: .8;
    overflow-x: hidden;
    animation: slide-up 1s ease;
  }
  .section-player.has-notes-position-sidenotes .notes-title{
    display: none;
  }
  .section-player.has-notes-position-sidenotes .notes-list{
    position: relative;
    top: calc(var(--gutter-medium) * -2.5);
  }
  
}
@media screen and (min-width: 1224px) {
  .section-player.has-notes-position-sidenotes .notes-list{
    top: calc(var(--gutter-medium) * -1);
  }
}
  
/** reset notes position in print and mobile*/
@media screen and (max-width: 768px) {
  .section-player.has-notes-position-sidenotes .notes-container{
    width: unset;
    position: relative;
    left: unset;
    height: unset;
    top: unset;
    padding-right: unset;
    font-size: unset;
    opacity: unset;
    padding-left: var(--content-margin-width);
  }
  .section-player.has-notes-position-sidenotes .notes-title{
    display: block
  }
  .section-player.has-notes-position-sidenotes .notes-list{
    top: unset;
  }
  .section-player.has-notes-position-sidenotes .note-item{
    position: relative!important;
    top: unset!important;
  }
}
@media print {
  .section-player.has-notes-position-sidenotes .notes-container{
    width: unset;
    position: relative;
    left: unset;
    height: unset;
    top: unset;
    padding-right: unset;
    font-size: unset;
    opacity: unset;
    padding-left: var(--content-margin-width);
  }
  .section-player.has-notes-position-sidenotes .notes-title{
    display: block
  }
  .section-player.has-notes-position-sidenotes .notes-list{
    top: unset;
  }
  .section-player.has-notes-position-sidenotes .note-item{
    position: relative!important;
    top: unset!important;
  }
}

/* navigation footer */
.navigation-footer{
  position : absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: var(--gutter-medium);
}
/* aligning the nav footer and notes list when notes are aside */
.section-player .navigation-footer,
.section-player.has-notes-position-footnotes .notes-container{
  padding-left: var(--content-margin-width);
}
.navigation-footer ul{
  margin: 0;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items; stretch;
  justify-content: center;
}
.navigation-footer li:not(:last-of-type) {
  margin-right: var(--gutter-medium);
}
.navigation-footer li{
  margin: 0;
  list-style-type: none;
}

.navigation-footer .navigation-item{
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
}
.navigation-footer .navigation-item-text{
  flex: 1;
}
/* notes */
.notes-list{
  margin-left: 0;
  padding-left: 0;
}
.note-item{
  list-style-type: none;
  margin: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  max-width: 100%;
}
.section-player.has-notes-position-sidenotes .note-item {
  max-width: calc(var(--content-margin-width) - 1rem);
  overflow: hidden;
}
.note-item > div{
  flex: 1;
  max-width: calc(100% - 1rem);
}
.note-block-pointer::after{
  content: '.';
  padding-right: var(--gutter-medium);
}

/* resource identity card */
.resource-identity-card{
  margin-bottom: var(--gutter-medium);
  margin-top: var(--gutter-medium);
}
.resource-identity-card .title{
  margin-bottom: var(--gutter-medium);
}
.resource-identity-card .type,
.resource-identity-card .source
{
  font-style: italic;
  opacity: .6;
  font-size: .8em;
}
.resource-identity-card .description{
  font-size: .7rem;
  font-style: italic;
  padding-right: 1rem;
}
.resource-identity-card .type::before{
  content: "◉";
  font-style: normal;
  padding-right: var(--gutter-medium);
}
.resource-identity-card .source::before{
  content: "△";
  font-style: normal;
  padding-right: var(--gutter-medium);
}
.resource-identity-card .main-info{
  font-weight: 800;
}

@media print{
  .resource-identity-card{
    padding: var(--gutter-medium);
    border: 1px solid black;
  }
}

/* related contexts */
.related-contexts-container{
  padding: 0;
}

.related-contexts .header .related-contexts-actions{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

/*
.related-contexts .header h2{
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
}
*/
.related-contexts .related-contexts-title{
  flex: 1;
}

.related-context{
  margin: 0;
  list-style-type: none;
}
.related-context .excerpt{
  font-size: .5em;
}
/* context-mention */
.mentions-container ul{
  padding: 0;
}
.related-context .context-mention{
  margin-bottom: var(--gutter-medium);
}
.context-mention{
}
.context-mention .mention-context-pointer{
  display: none;
}
.context-mention .header,
.context-mention .footer{
  font-size: .5em;
  position: relative;
  left: 1rem;
}
.context-mention .header{
  top: 1rem;
}
.context-mention .footer{
  bottom: 1rem;
}
.context-mention .excerpt{
  padding: var(--gutter-medium);
  // margin-top: calc(.5 * var(--gutter-medium));
  // margin-bottom: calc(.5 * var(--gutter-medium));
  border-left: 1px solid var(--color-text);
}

/**
 * NETWORK VIEWS COMPONENT STYLING
 */
.graph-container svg
{
  position: fixed;
  width: 100%!important;
  height: 100%!important;
  left: 0;
  top: 0;
}
/**
 * EVENTS VIEWS COMPONENT STYLING
 */
.events-player .main-column .big-list-item {
    border-left: 1px solid var(--color-text);
    padding-left: var(--gutter-medium);
    margin-bottom: 0;
    padding-bottom: var(--gutter-medium);
}
.events-player .main-column .big-list-item:first-of-type{
    padding-top: calc(3 * var(--gutter-medium));

}
.events-player .main-column .big-list-item-content h3::before {
  content: "◉";
  position: relative;
  left: calc(var(--gutter-medium) * -1.6);
}
.events-player .main-column .big-list-item-actions{
  padding-left: var(--gutter-medium);
}
.event-details > span,
.location-details > span
{
  margin-right: var(--gutter-medium);
}
/**
 * PLACES VIEWS COMPONENT STYLING
 */
.places-container {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.location-details{
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;
  align-items: center;
}
.location-details em{
  flex: 1;
}
.localization-marker{
  cursor: pointer;
}
.localization-entries-list{
  margin-left: 0;
  top: -1rem;
  left: -1rem;
  position: relative;
}
.localization-entry{
  font-style: italic;
  display: inline-block;
  padding-right: calc(var(--gutter-medium) * 2);
  padding: calc(var(--gutter-medium) * .5);
  background: rgba(255,255,255,.9);
  list-style-type: none;
}
.glossaries-related-to-place-list .related-contexts:not(:last-of-type),
.glossaries-related-to-event-list .related-contexts:not(:last-of-type)
{
  border-bottom: .3em solid var(--color-link-default);
  margin-bottom: var(--gutter-medium);
  padding-bottom: var(--gutter-medium);
}

/**
 *  =============
 * ANIMATIONS
 * ==============
 * */
@keyframes appear {
  0% {
      opacity: 0;
  }
  100% {
      opacity: 1;
  }
}
`;

export default styles;
