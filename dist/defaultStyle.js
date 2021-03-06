"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
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
  /*--color-link-default: #99B6BD;*//* bleu délavé */
  --color-link-default: #4c818d;
  --color-link-active:#D4613E;/* rouille */
  --color-text: #4d4c4c;

  --desktop-nav-width: 16%;
  --desktop-aside-width: 20%;

  --content-margin-width: 20vw;

  --gutter-medium: 1rem;
  --gutter-large: 2rem;

  font-size: 18px;
  --font-family-serif: 'Source serif pro', serif;
  --font-family-sans: 'Source sans pro', serif;
}

@media screen and (min-width: 1224px){
  :root{
    font-size: 18px;
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
  padding-top: .4rem;
}
.deucalion-layout .nav-content-container{
  overflow-y: auto;
  max-height: calc(100% - var(--mobile-nav-head-height) * 2);
  /* max-width: var(--tablet-main-width) */
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
  align-items: center;
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
  overflow-y: auto;
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
  :root {
    font-size: 13px;
  }

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
    left: 0!important;
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

  .annotator-frame {
    display: none!important;
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
  font-family: var(--font-family-serif);
}
.deucalion-layout h1,
.deucalion-layout h2,
.deucalion-layout h3,
.deucalion-layout h4,
.deucalion-layout h5,
.deucalion-layout h6
{
  font-family: var(--font-family-sans);
}
.link:not(sup),
a,
a:visited,
.inline-glossary
{
  color: var(--color-link-default);
  cursor: pointer;
  text-decoration: none;
}
.rendered-content .link:not(sup):hover,
.rendered-content a:hover,
.rendered-content .inline-glossary:hover
{
  color: var(--color-background);
  background: var(--color-link-default);
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
.inline-contextualization-container{
  cursor: pointer;
  transition : .5s ease;
}
.inline-contextualization-container:hover,
.inline-contextualization-container.active
{
  color: white;
  background: var(--color-link-default);
}
.inline-contextualization-container:hover  a,
.inline-contextualization-container.active a
{
  color: white;
}
/* bibliographic citations */
.csl-entry {
    // word-break: break-all;
}
cite{
  font-style: inherit;
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
  padding-right: var(--gutter-medium);
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

/*
.main-column .rendered-content .unstyled:first-of-type::first-letter{
  font-size:3.5em;
  padding-right:0.1em;
  padding-bottom: 0;
  float:left;
}
*/
h1{
    font-size: 1.5em;
    margin-bottom: .5em;
}

.rendered-content blockquote{
  margin: 0;
  margin-bottom: var(--gutter-medium);
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

.resource-header-container{
  margin-bottom: 1rem;
}

/**
 * Figures (general)
 */
.block-contextualization-container,
.block-contextualization-container figure
{
  padding: 0;
  margin: 0;
  transition: .5s ease;
}
.block-contextualization-container .figure-caption{
  /*border-top: 1px solid var(--color-link-default);*/
  padding: var(--gutter-medium);
  font-size: .8em;
}

.block-contextualization-container .figure-caption .link{
  color: inherit;
}

.block-contextualization-container:hover,
.block-contextualization-container.active
{
  color: white;
  background: var(--color-link-default)
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
  min-width: 100%;
  // max-height: 80vh;
  // min-height: 40vh;
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

.inline-contextualization-container.image{
  cursor: pointer;
}

.inline-images-container img {
      max-width: 2rem;
      max-height: 1rem;
      padding-right: .3rem;
}

.block-contextualization-container.embed{
  min-height: 50vh;
  position: absolute;
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.block-contextualization-container.embed .fullscreen > div{
  height: 100%;
}

.block-contextualization-container.embed .fullscreen-btn{
  position : absolute;
  right: 1rem;
  bottom: 4rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: white;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.block-contextualization-container.embed .fullscreen .fullscreen-btn{
  right: 1rem;
  botttom: 1rem;
}
.peritext-contextualization.block.embed .cover{
  position: relative;
  cursor: pointer;
}

.peritext-contextualization.block.embed .cover img{
  max-width: 100%;
  max-height: 100%;
  min-height: unset;
}


.block-contextualization-container.embed .cover h3{
      background: rgba(0,0,0,0.8);
      color: white;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: .5s ease;
      padding: 0;
      margin: 0;
}
.block-contextualization-container.embed .cover h3&:hover{
  background: rgba(0,0,0,0.5);
}

.block-contextualization-container.table{
  max-width: 100%;
  width: 100%;
}
.block-contextualization-container.table .static-table-container{
  max-width: 100%;
  width: 100%;
  position: relative;
  overflow: auto;
  max-height: 70vh;
  // height: 70vh;
}
.block-contextualization-container.table .static-table-container table{
  // position: absolute;
  // left: 0;
  // top: 0;
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
    max-width: 20vw;
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

.block-contextualization-container.vegaLite .vega-embed details{
  display: none;
}

.block-contextualization-container.sourceCode pre{
  background: var(--color-background);
  max-height: 50vh;
  overflow-y: auto;
  color: var(--color-text);
}

.block-contextualization-container.sourceCode:hover pre{
  color: var(--color-text);
}

.block-contextualization-container.video
{
  position: relative;
  overflow: hidden;
  max)height: 15rem;
}
.peritext-contextualization.block.video,
.block-contextualization-container.video .peritext-contextualization .media > div > div{
  position: relative;
  height: 15rem;
  max-height: 15rem;
  overflow: hidden;
}
.block-contextualization-container.video .peritext-contextualization .media > div,
.block-contextualization-container.video .peritext-contextualization .media iframe{
  max-width: 100%;
  max-height: 100%;
  min-height: unset;
}
.block-contextualization-container.video .media{
  height: 100%;
}

/**
 * Inline (specific)
 * */
.block-contextualization-container.bib {
  cursor: pointer;
}

/**
 * BIG LISTS (GLOSSARY, REFERENCES, ...)
 */
.big-list-items-container{
  padding: 0;
}

.big-list-item-actions .link{
  font-size: .8rem;
  padding: 0;
  font-family: inherit;

}

.big-list-item{
  margin: 0;
  list-style-type: none;
  // margin-bottom: var(--gutter-medium);
  padding: var(--gutter-medium);
  padding-right: calc(2*var(--gutter-medium));
  padding-left: 0;
  transition: all .5s ease;
}

.big-list-item.active{
  padding-right: var(--gutter-medium);

  background: var(--color-link-default);
  color: white;
  padding-left: var(--gutter-medium);

}

.big-list-item.active a,
  .big-list-item.active .link{
  color: inherit;
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
}
.nav-content-container ul{
  margin: 0;
  padding: 0;
  margin-top: var(--gutter-medium);
  padding-left: calc(var(--gutter-medium) * 2);
  font-family: var(--font-family-sans);
  font-weight: 600;
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
  margin-bottom: .2rem;
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
    font-size: 1rem;
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

.aside .aside-header{
  display: flex;
  flex-flow: row-reverse nowrap;
  justify-content: stretch;
  align-items: flex-start;
  padding-top: var(--gutter-medium);
}
.aside .aside-header .csl-entry a {
  word-break: break-word;
}

@media screen and (min-width: 1224px) {
  .aside .aside-content .aside-header{
    min-height: 2.5rem;
    align-items: flex-start;
  }
}

.aside .aside-header .aside-title{
  flex: 1;
  margin: 0;
  overflow: hidden;
  max-width: calc(100% - 5rem);
}

@media screen and (min-width: 768px) {
  .aside .aside-header .aside-title{
    max-width: calc(100% - 1rem);
  }
}

.aside .aside-header .aside-title .csl-entry{
  font-size: .8em;
  margin-right: 2rem;
}

.aside .aside-close-btn{
  font-size: 1em;
  line-height: 1;
  padding-left: 0;
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
  height: calc(100% - 3rem);
}
.deucalion-layout .railway .elevator{
  position: absolute;
  left: 0;
  background: rgba(0,0,0,0.1);
  width: 100%;
  pointer-events: none;
}
.deucalion-layout .railway .shadow.h1,
.deucalion-layout .railway .shadow.h2,
.deucalion-layout .railway .shadow.h3,
.deucalion-layout .railway .shadow.h4,
.deucalion-layout .railway .shadow.h5,
.deucalion-layout .railway .shadow.h6 {
  background: var(--color-link-active);
  border: 1px solid var(--color-link-active);
}
.deucalion-layout .railway .railway-title{
  font-size: 0.5rem;
  right: 1.2rem;
  position: absolute;
  top: -0.3rem;
  text-align: right;
  font-style: italic;
  width: 20vw;
  opacity: .5;
  transition: opacity .5s ease;
}

.deucalion-layout .railway .railway-title:hover{
  opacity: 1;
}

.deucalion-layout .railway.h2 .railway-title {
  font-size: 0.4rem;
}

.deucalion-layout .railway.h3 .railway-title,
.deucalion-layout .railway.h4 .railway-title,
.deucalion-layout .railway.h5 .railway-title,
.deucalion-layout .railway.h6 .railway-title
 {
  font-size: 0.3rem;
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
}

.landing-player .links{
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  align-items: flex-start;
  font-family: var(--font-family-sans);
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
  .deucalion-layout.has-view-class-landing .nav-header{
    display: none;
  }
  .deucalion-layout.has-view-class-landing .nav-header .title{
    display: block;
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

.loader{
  position: fixed;
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.5);
  align-items: center;
  justify-content: center;
  transition: opacity .2s ease;
  left: 0;
  top: 0;
  opacity: 0;
  pointer-events: none;
}

.loader span{
  background: var(--color-link-default);
  color: white;
  width: 30vh;
  height: 30vh;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.1);
  transition: .2s ease;
}

.loader.active{
  opacity: 1;
}
.loader.active span{
  transform: scale(1);
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
    padding-left: var(--gutter-medium);
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
    max-width: calc(100% - var(--gutter-large))!important;
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
    padding-left: var(--gutter-large);
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
    max-width: unset!important;
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
  position: relative;
  transition: all .5s ease;
  left: 0;
  right: 0;
}

.navigation-footer li.prev:hover{
  right: var(--gutter-medium);
  left: unset;
}
.navigation-footer li.next:hover{
  left: var(--gutter-medium);
  right: unset;
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
  max-width: calc(var(--content-margin-width) - 2rem);
  overflow: hidden;
}
.note-item > div{
  flex: 1;
  max-width: calc(100% - 1rem);
}
.note-block-pointer.link{
  padding: .1em;
  padding-left: .3em;
  padding-right: 0;
  height: 1.5em;
  margin-right: var(--gutter-medium);
  color: inherit;
}
.note-block-pointer::after{
  content: '.';
}

.note-content-pointer{
  cursor: pointer;
}

/* resource identity card */
.resource-identity-card{
}
.resource-identity-card .title{
  margin-bottom: var(--gutter-medium);
}
.resource-identity-card .type,
.resource-identity-card .source,
.resource-identity-card .authors
{
  font-size: .8em;
}
.resource-identity-card .source,
.resource-identity-card .authors
{
  display: flex;
  flex-flow: row wrap;
}
.resource-identity-card .description{
  font-size: .7rem;
  font-style: italic;
  padding-right: 1rem;
}
.resource-identity-card .type::before{
  content: "△";
  font-style: normal;
  padding-right: var(--gutter-medium);
}
.resource-identity-card .source::before{
  content: "△";
  font-style: normal;
  padding-right: var(--gutter-medium);
}
.resource-identity-card .authors::before{
  content: "ጰ";
  font-style: normal;
  padding-right: var(--gutter-medium);
}
.resource-identity-card .main-info{
  font-weight: 800;
}
.resource-identity-card .additional-info{
  margin-top: .5rem;
}

/**
 * Specific print styles
 */
@media print{
  .resource-identity-card{
    padding: var(--gutter-medium);
    border: 1px solid black;
  }

  .block-contextualization-container.table .static-table-container{
    height: unset;
  }

  .inline-contextualization-container, .link, a {
    color: inherit!important;
  }
}

/* related contexts */
.related-contexts{
  display: flex;
  flex-flow: column nowrap;
  justify-content: stretch;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}
.related-contexts .body{
  flex: 1;
  overflow: hidden;
}

.related-contexts-container{
  padding: 0;
  flex: 1;
  overflow: auto;
  margin-top: 0;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
  justify-contents: stretch;
}
.related-contexts-container .related-contexts-list{
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: var(--gutter-medium);
  padding-left: 0;
}

.related-contexts-container > h3{
  font-size: 1rem;
}

.related-contexts .header {
  /*padding-top: var(--gutter-medium);*/
}

.related-contexts .header .related-contexts-actions{
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  font-size: .8em;
}

.related-contexts .header .related-contexts-actions .link::before,
.related-contexts .mentions-title::before,
.related-contexts .header .related-contexts-actions a::before,
.big-list-item-actions .link::before{
  content: "◉";
  font-style: normal;
  padding-right: var(--gutter-medium);
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

.related-contexts .footer{
  padding-top: var(--gutter-medium);
  padding-bottom: var(--gutter-medium);
}
.related-contexts .footer .link{
  font-size: .8em;
}

.related-contexts .footer .link::before{
  content: "◉";
  font-style: normal;
  padding-right: var(--gutter-medium);
  font-size: .8em;
}

.related-context{
  margin: 0;
  list-style-type: none;
}
.related-context .excerpt{
  font-size: .9em;
}
/* context-mention */

.related-contexts .mentions-title-container{
  padding-top: 1rem;
  font-size: .8em;
}

.mentions-container ul{
  padding: 0;
}
.related-context .context-mention{
  margin-bottom: var(--gutter-medium);
}
.context-mention{
}
.context-mention.is-active{
  background: var(--color-link-default);
}
.context-mention.is-active .excerpt a,
.context-mention.is-active .excerpt a .link,
.context-mention.is-active .excerpt .inline.glossary,
.context-mention.is-active .excerpt .mention-section-name
{
  color: white;
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
  background: rgba(0,0,0,0.03);
}
.context-mention .excerpt blockquote{
  background: none;
}
.context-mention .excerpt .link.active{
  color: inherit;
}

.context-mention .excerpt .mention-section-name{
  margin-bottom: 0;
}

/**
 * NETWORK VIEWS COMPONENT STYLING
 */
.graph-placeholder{
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
/*
.graph-container svg
{
  position: absolute;
  width: 100%!important;
  height: 100%!important;
  left: 0;
  top: 0;
}*/
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
.events-player .main-column .big-list-item-content h4{
  position: relative;
  left: var(--gutter-medium);
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

/**
 * DRAFTS
 */
@media screen and (max-width: 768px) {
  .deucalion-layout .main-container .main-column{
    padding-left: 1rem;
  }
  .aside .aside-content{
    padding-left: 1rem;
    max-width: calc(100% - 2rem);
  }
  .aside .aside-header {
    flex-flow: row nowrap;
    max-width: calc(100% - 2rem);
  }
  .aside .aside-header .aside-title{
    max-width: unset;
  }
  .aside .related-contexts-list {
    padding-right: 2rem;
  }
}
`;
var _default = styles;
exports.default = _default;