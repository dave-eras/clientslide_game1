/*******************************************************************
Name: StartUp step 1

Purpose:
  Startup code to load global javascript / CSS files.
  Those global files contain variables and functions, which are then 
  made available to all the slides in the Story. 
  These other files are found in the project sub-directory:
  .../webObject/
       index.html
       globals/
          globalScripts.js

  You can check execution of this script, by publishing and viewing 
  the project, and press <ctrl><shift>J in the browser to pop up the
  browser console log
*******************************************************************/



/**** Global Variables ****/

// The constants numLibs and webObjectURL need to change
// when you change something in the project webObject folder.
// And we must delete and inset a new webObject in the first slide, 
// and update webObjectURL.
var loadedCount = 0;
let numLibs = 3;   // sum of js and css files to load
let webObjectURL = "5ZFieU8qwIt";

var player = GetPlayer( );



/**** Global Functions ****/

// startLoadJSfile loads a javascript file into the global storyline space
//   on completion sets storyline variable javascriptLoaded true
function startLoadJSfile( filename, filetype )
{
    if( filetype == "js" ) //if filename is a JavaScript file
    {
        var fileref = document.createElement( 'script' );
        fileref.setAttribute( "type", "text/javascript" );
        fileref.setAttribute( "src", filename );
        
	    fileref.onload = 
	    function( ) 
	    {
	      loadedCount++;
	      console.log( loadedCount + " JS / " + filename + " loaded" );
	      if( loadedCount >= numLibs )
	      {
	         player.SetVar( "javascriptLoadedState", 1 );
	      }
	    };
    }
    
    if( typeof fileref != "undefined" )
        document.getElementsByTagName( "head" )[ 0 ].appendChild( fileref );
}

// startLoadCSSfile loads a CSS file into the global storyline space
//   on completion sets storyline variable javascriptLoaded true
function startLoadCSSfile( filename, filetype )
{
    if( filetype== "css" )    //if filename is a CSS file
    { 
        var fileref = document.createElement( "link" );
        fileref.setAttribute( "rel", "stylesheet" );
        fileref.setAttribute( "type", "text/css" );
        fileref.setAttribute( "href", filename );
        
	    fileref.onload = 
	    function( ) 
	    {
	      loadedCount++;
	      console.log( loadedCount + " CSS / " + filename + ' loaded.');
	      if( loadedCount >= numLibs )
	      {
	         player.SetVar( "javascriptLoadedState", 1 );
	      }
	    };
    }
    
    if( typeof fileref != "undefined" )
        document.getElementsByTagName( "head" )[ 0 ].appendChild( fileref );
}



/**** Main StartUp Program ****/

// ACCESS to webObjectUrl is broken after we call loadJSfile()
//   never worked out why ???
//   so use it beforehand
let webObjectFolder = "./story_content/WebObjects/"+webObjectURL+"/";

try
{
   player.SetVar( "webObjectId", webObjectURL );
   var str = player.GetVar( "webObjectId" );
   console.log( "set StoryLine variable webObjectId = " + str );
}
catch( error )
{
   console.error( "Failed to set Storyline variable webObjectId" + error );
}

// load webObject libraries
//   note each load will run as a background task and may not complete
//   in the same calling order

// load the globalScripts.js file into this storyline
startLoadJSfile( "globals.js", "js" );
