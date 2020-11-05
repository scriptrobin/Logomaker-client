import {
  Component,
  OnInit
} from '@angular/core';
import * as $ from 'jquery';
import {
  fabric
} from 'fabric';
import {
  HttpClient,HttpHeaders
} from "@angular/common/http";
import {
  ColorPicker
} from '@syncfusion/ej2-inputs';
@Component({
  selector: 'app-editorhome',
  templateUrl: './editorhome.component.html',
  styleUrls: ['./editorhome.component.css']
})
export class EditorhomeComponent implements OnInit {
  
  activeObj;
  propstxt: string;
  displayText: string = "test";
  colorValue = '#1c9f1cff';
  fontFamily;
  propscolorValue = '#1c9f1cff';
  shapeBorderValue = '1c9f1cff';
  borderwidValue = 0;
  opacityValue=1;
  selectedfontProps = '';
  shadowon;
  switchShadow=true;
  leftBlockTransit=false;
  iconSearchtxt='abstract';
  svgUrl=[];
  iconsLoader=false;
  loadmoreCount = 40;
  shadowProps = {
    'color': 'black',
    'blur': 0,
    'offsetX': 0,
    'offsetY': 0,
    'on': false
  };
  public colorPickerArray = [{
      'color': '#E94A35',
      'selected': true
    },
    {
      'color': '#F59D00',
      'selected': false
    },
    {
      'color': '#F5E100',
      'selected': false
    },
    {
      'color': '#009755',
      'selected': false
    },
    {
      'color': '#0073BF',
      'selected': false
    },
    {
      'color': '#083D7A',
      'selected': false
    },
    {
      'color': '#6EC4FD',
      'selected': false
    },
    {
      'color': '#7935E9',
      'selected': false
    },
    {
      'color': '#000000',
      'selected': false
    },
    {
      'color': '#B58989',
      'selected': false
    },
    {
      'color': '#D2B85C',
      'selected': false
    },
    {
      'color': '#745029',
      'selected': false
    },
    {
      'color': '#790000',
      'selected': false
    },
    {
      'color': '#6DF2B5',
      'selected': false
    },
    {
      'color': '#F26D7D',
      'selected': false
    },
    {
      'color': '#B7B7B7',
      'selected': false
    }
  ];
  /* public options: string[] = [
          "Arial",
          "Courier", 
          "Comic Sans MS",
          "Charcoal",
          "monospace",
          "Helvetica",
          "Georgia", 
          "serif", 
          "Palatino Linotype", 
          "Roboto",
          "Turret Road",
          "Book Antiqua", 
          "Henny Penny",
          "Verdana" 
  ]; */
  private wieghtOptions: string[] = ["10", "20", "30"];
  selectedWeight = "10";
  selectedFont = "Georgia";
  constructor(private http: HttpClient) {

  }

  private canvas: any;
  ngOnInit(): void {
    $(".sidebar-dropdown > a").click(function () {
      $(".sidebar-submenu").slideUp(200);
      if (
        $(this)
        .parent()
        .hasClass("active")
      ) {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .parent()
          .removeClass("active");
      } else {
        $(".sidebar-dropdown").removeClass("active");
        $(this)
          .next(".sidebar-submenu")
          .slideDown(200);
        $(this)
          .parent()
          .addClass("active");
      }
    });

    $("#close-sidebar").click(function () {
      $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
      $(".page-wrapper").addClass("toggled");
    });

    /* $('.colors').hide();
    $('#expandcolors').click(function() {
      $('.colors').slideToggle();
      $(this).toggleClass('transform');
      $(".tooltip, img").fadeOut();
      
    }); */


    this.canvas = new fabric.Canvas('canvas', {
      selection: true,
      selectionBorderColor: 'blue',
      backgroundColor: 'rgb(255,255,255)',
      width: 800,
      height: 500
    });
    var __self = this;
    this.canvas.on('selection:created', function (ev, args) {
      __self.onObjectSelected(ev, args);
    });

    this.canvas.on('selection:updated', function (ev, args) {
      __self.onObjectSelected(ev, args);
    });

    this.canvas.on('selection:cleared', function (ev, args) {
      __self.onObjectDeselected(ev, args);
    }); 
    this.getGoogleFonts();
    this.getSearchIcons(null);
    // this.getIconfinderIcons();
  }

  loadIcons(){
    this.leftBlockTransit = true; 
  }

  changeCanvasBackgroundbyPicker(event) {
    this.canvas.backgroundColor = event.currentValue.hex;
    this.canvas.renderAll();
  }

  changeCanvasBackground(colorValue) {
    this.canvas.backgroundColor = colorValue.color;
    this.canvas.renderAll();
  }

  changeShapesColor(event) {
    this.activeObj.set('fill', event.currentValue.hex);
    this.canvas.renderAll();
  }

  changeBorderColor(event) { 
    this.activeObj.set('stroke', event.currentValue.hex);
    this.canvas.renderAll();
  }

  changeBorderWidth(val) {
    this.borderwidValue = parseInt(val);
    this.activeObj.set('strokeWidth', this.borderwidValue);
    this.canvas.renderAll();
  }

  changeOpacity(val){
    this.opacityValue = val;
    this.activeObj.set('opacity', this.opacityValue/100);
    this.canvas.renderAll();
  }

  changefontStyles(type) { 
    this.selectedfontProps = type;
    if(type == "underline") {
      this.activeObj.set("underline", true);
    }
    else if(type == "bold" || type == "italic") {
      this.activeObj.set("fontWeight", type);
    }
    else if(type == "right" || type == "left"|| type == "center") {
      this.activeObj.set("textAlign", type);
    }
    this.canvas.renderAll();
  }

  changeShadow(value, type) { 
    if(type == 'blur') {
      this.shadowProps.blur = value;
    }
    else if(type == 'color') {
      this.shadowProps.color = value.currentValue.hex;
    }
    else if(type == 'x') {
      this.shadowProps.offsetX = value;
    }
    else if(type == 'y') {
      this.shadowProps.offsetY = value;
    } 
    this.activeObj.set('shadow',  `${this.shadowProps.color} ${this.shadowProps.offsetX}px ${this.shadowProps.offsetY}px ${this.shadowProps.blur}px`); 
    if(this.activeObj.jsonProperty.shadow) {
      this.activeObj.jsonProperty.shadow = JSON.parse(JSON.stringify(this.shadowProps));
    }
    this.canvas.renderAll();
  }

  applyFlipObj(type) {
    this.activeObj.toggle(type);
    this.canvas.renderAll();
  }

  doObjAction(type) {
    if(type == 'delete') { 
      this.canvas.remove(this.activeObj);
    }
    else if(type == 'duplicate') {
      this.duplicateObject();
    }
    else if(type == 'forward') {
      this.canvas.bringToFront(this.activeObj);
    }
    else if(type == 'backward') {
      this.canvas.sendToBack(this.activeObj);
    } 
    
    
  }

  duplicateObject() {
    var _clipboard
    var _self = this;
    var activeObj = this.canvas.getActiveObject();
    var _name = activeObj.name;
    var cloneJSON = JSON.parse(JSON.stringify(this.activeObj.jsonProperty));
    activeObj.clone(function(cloned) {
     _clipboard = cloned;
      _clipboard.clone(function(clonedObj) {
        _self.canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 10,
          top: clonedObj.top + 10,
          evented: true,
        });
        clonedObj.jsonProperty = cloneJSON;
        clonedObj.name = _name;
        if (clonedObj.type === 'activeSelection') {
          // active selection needs a reference to the canvas.
          clonedObj.canvas = _self.canvas;
          clonedObj.forEachObject(function(obj) {
            _self.canvas.add(obj);
          });
          // this should solve the unselectability
          clonedObj.setCoords();
        } else {
          _self.canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        _self.canvas.setActiveObject(clonedObj);
        _self.canvas.requestRenderAll();
      });
    }); 
  }
  
  
  openShadowProps(value){ 
    if(value) {
      this.switchShadow = true; 
      this.shadowProps = this.activeObj.jsonProperty.shadow || this.shadowProps;
      this.activeObj.set('shadow',  `${this.shadowProps.color} ${this.shadowProps.offsetX}px ${this.shadowProps.offsetY}px ${this.shadowProps.blur}px`); 
      this.canvas.renderAll();
    }
    else {
      this.switchShadow = false;
      this.activeObj.set('shadow', 'black, 0px, 0px, 0px');
      this.canvas.renderAll();
    }


  }

  addSimpleText() {
    var text = new fabric.Text('Add text', {
      left: this.canvas.getWidth()/2,
      top: this.canvas.getHeight()/2,
      fontFamily: 'Comic Sans',
      fontSize: 60,
      'originX': 'center',
      'originY': 'center'
    });
    text.jsonProperty = {
      displayText: 'Add text',
      shadow : {
        'color': 'black',
        'blur': 0,
        'offsetX': 0,
        'offsetY': 0,
        'on': false
      }
    }
    text.name = "simpleText"; 
    this.activeObj = text;
    // this.changeShadow(null, null);
    this.canvas.add(text);
    this.setActiveObject(text);
  }

  addCircle() {
    var circle = new fabric.Circle({
      radius: 100,
      fill: '#16c7ff',
      left: this.canvas.getWidth()/2,
      top: this.canvas.getHeight()/2,
      stroke: "#000",
      strokeWidth: 0,
      'originX': 'center',
      'originY': 'center'
    });
    circle.name = "shapes";
    circle.jsonProperty = {};
    circle.jsonProperty.shadow = {
      'color': 'black',
      'blur': 0,
      'offsetX': 0,
      'offsetY': 0,
      'on': false
    };
    this.activeObj = circle;
    // this.changeShadow(null, null);
    this.canvas.add(circle);
    this.setActiveObject(circle);
  }

  addRectangle() {
    var rect = new fabric.Rect({
      left: this.canvas.getWidth()/2,
      top: this.canvas.getHeight()/2,
      width: 300,
      height: 300,
      fill: 'rgb(200, 185, 162)',
      originX: 'center',
      originY: 'center',
      stroke: "#000",
      strokeWidth: 0
    });
    rect.name = "shapes";
    rect.jsonProperty = {};
    rect.jsonProperty.shadow = {
      'color': 'black',
      'blur': 0,
      'offsetX': 0,
      'offsetY': 0,
      'on': false
    };
    this.activeObj = rect; 
    this.canvas.add(rect);
    this.setActiveObject(rect);
  }

  onObjectSelected(ev, args) {
    this.activeObj = ev.selected[0];
    this.propstxt = this.activeObj.name; 
    this.switchShadow =  this.activeObj.jsonProperty.shadow ? true :false; 
    this.shadowProps = JSON.parse(JSON.stringify(this.activeObj.jsonProperty.shadow));
  }

  onObjectDeselected(ev, args) {
    this.activeObj = null;
    this.propstxt = "";
  }

  setActiveObject(obj) {
    this.canvas.setActiveObject(obj);
    this.activeObj = obj;
    this.propstxt = obj.name;
  }

  updateSimpleText() {
    this.activeObj.text = this.activeObj.jsonProperty.displayText;
    this.canvas.renderAll();
  }

  applyFontStyle(font) {
    /* this.activeObj.set({
      'fontFamily' : this.selectedFont
    }); */
    this.activeObj.set("fontFamily", font.family);
    this.setActiveObject(this.activeObj);
    this.canvas.renderAll();
  }

  getSearchIcons(type) { 
    var headers = {
      headers: new HttpHeaders({
        'authorization': 'Bearer iUFwBIBD9G71OqGMW2yFgW2O0svxgHuEZrvBzmJ5vcA1U1adNbfUqxHwTVrD0inG', 
        'Content-Type':'text/plain; charset=utf-8'
      })
    };
    this.iconsLoader = true;
    
    if(type == 'loadmore') {
      this.loadmoreCount+=30;
    }else {
      this.svgUrl = [];
      this.loadmoreCount = 40;
    }
    this.http.get("https://try.readme.io/https://api.iconfinder.com/v4/icons/search?query="+this.iconSearchtxt+"&count="+this.loadmoreCount+"", headers).subscribe((response:any)=> { 
      this.iconsLoader = false;
      for(var i=0;i<response.icons.length;i++) { 
        if(response.icons[i].vector_sizes) {
          for(var j=0;j<response.icons[i].vector_sizes.length;j++) {
            for(var k=0;k<response.icons[i].vector_sizes[j].formats.length;k++) { 
              this.svgUrl[i] = {'download_url': '', 'preview_url' : ''};
              if(response.icons[i].vector_sizes[j].formats[j].download_url) {
                this.svgUrl[i].download_url = response.icons[i].vector_sizes[j].formats[j].download_url;
              }
            }
          }
        }
        if(response.icons[i].raster_sizes[5]) {
          for(var j=0;j<response.icons[i].raster_sizes[5].formats.length;j++) { 
            if(response.icons[i].raster_sizes[5].formats[j].preview_url) {
              this.svgUrl[i].preview_url = response.icons[i].raster_sizes[5].formats[j].preview_url;
            }
          } 
        }
      }
    });
  }

  getSvgIcon(data) { 
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
        'authorization': 'Bearer jGamcBUVyWEKIf679UMHPYfQk3sfcysHwfd0YwBY6Dfy5AzTB9W9XSPEY4RavCAP',
        'Access-Control-Allow-Origin': 'http://localhost:4200' ,
        "Access-Control-Allow-Methods":"GET, POST"
      }),
      responseType: 'text'
   }
    var iconSvgUrl = "https://cors-anywhere.herokuapp.com/"+data.download_url; 
    var __self = this;
    this.http.get<any>(iconSvgUrl, HTTPOptions).subscribe((response)=> {
      fabric.loadSVGFromString(response, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        obj.left = __self.canvas.getWidth()/2;
        obj.top = __self.canvas.getHeight()/2;
        obj.originX = 'center';
        obj.originY = 'center';
        obj.name = "shapes";
        var widRatio = (__self.canvas.getWidth() -50) /obj.width;
        var heiRatio = (__self.canvas.getHeight() - 50 )/obj.height;
        if(widRatio  < heiRatio) {
          obj.scaleX = widRatio;
          obj.scaleY = widRatio;
        }
        else {
          obj.scaleX = heiRatio;
          obj.scaleY = heiRatio;
        }
        obj.jsonProperty = {
          shadow : {
            'color': 'black',
            'blur': 0,
            'offsetX': 0,
            'offsetY': 0,
            'on': false
          }
        }
        __self.canvas.add(obj).renderAll();
        obj.setCoords();
        __self.setActiveObject(obj);
      });
    }, function(err){
      console.log(err);
    });
  }

  getGoogleFonts() {
    this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBNhbaIulKGBHdPwBJPPsLEZcwcnTfTpaI').subscribe((responseData: any) => {
      this.fontFamily = responseData.items;
      for (var i = 0; i < responseData.items.length; i++) {
        const fontUrl = `https://fonts.googleapis.com/css?family=${responseData.items[i].family}&display=swap`;
        const styles = `
        @font-face {
          font-family: 'font1';
          src: url(${fontUrl}) format('ttf');
        }
        h1, h2, h3 {
          font-family: font1, sans-serif;
        }`
        const node = document.createElement('style');
        node.innerHTML = styles;
        document.body.appendChild(node);
      }

      console.log(responseData);
    })
  }  

}