import { Component, OnInit,   ViewChild} from '@angular/core';  
import { Router } from '@angular/router';
import {UserService} from '../shared/user.service';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver';
import {environment} from '../../environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: []
})
export class DashboardComponent implements OnInit {
  userProfile;
  selectedTab='dashboard';
  thumbCanvas = null;
  iconName = '';
  keywordText = '';
  loadmoreCount = 40;
  svgUrl=[];
  fontFamily;
  logos = [];
  fontIndex = 0;
  showLoader:boolean=false;
  showLazyLoading:boolean=true;
  iconCategories = [];
  iconStyles = [];
  iconListStyles = [];
  showListIconStyle:boolean = false;
  selectedIconIndex: any;
  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserProfile(); 
    this.getGoogleFonts();
    /* this.getIconCategory(); */
    this.getIconsStyles();
      /* this.logos.push({
        id: 'logoContainer_0',
        text: 'Logomaker'
      }) */
  }

  @ViewChild('cardChart') cardChart; 

  goToEditor(selectedlogo, index) {
    delete this.logos[index].canvas;
    localStorage.setItem('selectedLogo', JSON.stringify(this.logos[index]));
    const { protocol, host } = window.location;
    if(environment.production) {
      const url = `${protocol}//${host}/Logomaker-client/editorhome`;
      window.open(url,'_blank');
    }
    else {
      const url = `${protocol}//${host}/editorhome`;
      window.open(url,'_blank');
    }
    // this.router.navigate(['/editorhome']).then(result => {  window.open(window.location.href, '_blank'); });
  }

  userLogout() {
    this.userService.deleteToken();
    this.router.navigateByUrl('/home');
  }

  getUserProfile() {
    this.userService.getUserProfile().subscribe((res)=> {
      this.userProfile = res["user"];
      this.loadThumbCanvas(); 
    });
  }

  changeTab(tab) {
    this.selectedTab = tab;
  }

  loadThumbCanvas() {
    this.thumbCanvas = new fabric.StaticCanvas('logoContainer', {
      selection: true,
      selectionBorderColor: 'blue',
      backgroundColor: 'rgb(255,255,255)',
      width: 372,
      height: 272
    });
    
  }

  getIconbyCategory(category) {
    this.keywordText = category.name;
    this.createLogos();
  }

  createLogos() {
    var _self = this;
    this.logos = [];
    this.getSearchIcons(null,function() {
      function createDynamiCanvas() {
        var i=0;
        function _asyncCanvas(key, svgUrl) {
          if(key == _self.svgUrl.length) {
            return;
          } 
          _self.showLazyLoading=true;
          var _width = _self.cardChart.nativeElement.getBoundingClientRect().width;
          var _height = 300 || _self.cardChart.nativeElement.getBoundingClientRect().height;
          _self.thumbCanvas = new fabric.StaticCanvas('logoContainer_'+key, {
            selection: true,
            selectionBorderColor: 'blue',
            backgroundColor: 'rgb(255,255,255)',
            width: parseInt(_width),
            height: parseInt(_height)
          });
          if(!svgUrl) {
            // _self.logos.splice(key, 1);
            key++;
            _asyncCanvas(key, _self.svgUrl[key]);
            return;
          }
          _self.fontIndex = key;
          _self.getSvgIcon(svgUrl,key, function() {
            key++;
            
            _asyncCanvas(key, _self.svgUrl[key]);
          });
        }
        _asyncCanvas(i, _self.svgUrl[i]);
      }
      createDynamiCanvas();
    });
  }

  getSearchIcons(type, callback) { 
    var headers = {
      headers: new HttpHeaders({
        'authorization': 'Bearer '+environment.apiIconKey, 
        'Content-Type':'text/plain; charset=utf-8',
        'noAuth': "true"
      })
    }; 
    
    if(type == 'loadmore') {
      this.loadmoreCount+=30;
    }else {
      this.svgUrl = [];
      this.loadmoreCount = 40;
    }
    this.showLoader=true;
    var _searchText = this.keywordText || this.iconName;
    this.http.get("https://try.readme.io/https://api.iconfinder.com/v4/icons/search?query="+_searchText+"&count="+this.loadmoreCount+"", headers).subscribe((response:any)=> { 
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
      for(var i=0;i<this.svgUrl.length;i++) {
        this.logos.push({
          'id': 'logoContainer_'+i,
          'text': this.iconName,
          'lazyLoad': true
        });
      }
      setTimeout( () => {
        this.showLoader=false;
        callback();
      })
    });
  }

  getIconCategory() {
    var headers = {
      headers: new HttpHeaders({
        'authorization': 'Bearer '+environment.apiIconKey, 
        'Content-Type':'text/plain; charset=utf-8',
        'noAuth': "true"
      })
    }; 
    this.http.get("https://try.readme.io/https://api.iconfinder.com/v4/categories?count=100", headers).subscribe((response:any)=> { 
      this.iconCategories = [];
      for(var i=0;i<response.categories.length;i++) {
        var _splitted = response.categories[i].name.split(',');
        if(_splitted.length) {
          for(var j=0;j<_splitted.length;j++) {
            var _obj = <any>{};
            _obj.name  = _splitted[j].replace('& ', '');
            _obj.identifier = response.categories[i].identifier;
            this.iconCategories.push(_obj);
          }
        }
        else {
          this.iconCategories.push(response[i]);
        }
      }
    });
  }

  getIconsStyles() {
    var headers = {
      headers: new HttpHeaders({
        'authorization': 'Bearer '+environment.apiIconKey, 
        'Content-Type':'text/plain; charset=utf-8',
        'noAuth': "true"
      })
    }; 
    this.iconStyles = [];
    
    this.http.get("https://try.readme.io/https://api.iconfinder.com/v4/styles?count=12", headers).subscribe((response:any)=> {
      
      this.iconStyles = response.styles;
    });
  }

  getIconListbyStyles(style, index) {
    this.selectedIconIndex = index;
    var headers = {
      headers: new HttpHeaders({
        'authorization': 'Bearer '+environment.apiIconKey, 
        'Content-Type':'text/plain; charset=utf-8',
        'noAuth': "true"
      })
    }; 
    this.iconListStyles = [];
    var _styles = style.identifier;
    this.showListIconStyle = true;
    this.http.get("https://try.readme.io/https://api.iconfinder.com/v4/styles/"+_styles+"/iconsets?count=50",
     headers).subscribe((response:any)=> {
      this.showListIconStyle = false; 
      for(var i=0;i<response.iconsets.length;i++) {
        for(var j=0;j<response.iconsets[i].categories.length;j++) {
          this.iconListStyles.push(response.iconsets[i].categories[j]);
        }
      }
      console.log(response);
    });
  }

  getSvgIcon(data,index, callback) { 
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
        'authorization': 'Bearer '+environment.apiIconKey,
        'Access-Control-Allow-Origin': 'http://localhost:4200' ,
        "Access-Control-Allow-Methods":"GET, POST",
        'noAuth': "true"
      }),
      responseType: 'text'
   }
    var iconSvgUrl = "https://cors-anywhere.herokuapp.com/"+data.download_url; 
    var __self = this;
    this.http.get<any>(iconSvgUrl, HTTPOptions).subscribe((response)=> {
      fabric.loadSVGFromString(response, function(objects, options) {
        var obj = fabric.util.groupSVGElements(objects, options);
        obj.left = __self.thumbCanvas.getWidth()/2;
        obj.top = 100;
        obj.originX = 'center';
        obj.originY = 'center';
        obj.name = "shapes";
        var widRatio = (__self.thumbCanvas.getWidth() -150) /obj.width;
        var heiRatio = (__self.thumbCanvas.getHeight() - 150 )/obj.height;
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
        var _colors = [];
        if(obj._objects) {
          for(var j=0;j<obj._objects.length;j++) {
            if((obj._objects[j].fill != '#FFFFFF' || obj._objects[j].fill != "#000000") && obj._objects[j].fill!= '') {
              _colors.push(obj._objects[j].fill);
            }
          }
        }
        __self.thumbCanvas.add(obj).renderAll();
        obj.setCoords();
        if(_colors[3]) {
          if(_colors[3] != '#FFFFFF' && _colors[3] != '#000000' && _colors[3] != "rgb(0,0,0)") {
            var _bgColor;
            if(_colors[3].id) {
              _bgColor = _colors[3];
            }
            else {
              _bgColor = __self.createMonoColors(_colors[3]);
            }
            __self.thumbCanvas.backgroundColor = _bgColor;
            __self.logos[index].backgroundColor = __self.thumbCanvas.backgroundColor;
          }
          var textColor = __self.createMonoColors(_colors[3]);
          if(textColor == __self.thumbCanvas.backgroundColor || textColor == "#ffffff" || textColor ==  "rgb(255,255,255)") {
            textColor = __self.createMonoColors(__self.thumbCanvas.backgroundColor);
          }
        }
        else {
          textColor = "#00000";
        }
        var _text = __self.iconName || "Logo Text Here";
        var _font =__self.fontFamily[__self.fontIndex].family;
        var text = new fabric.Text(_text, {
          left: __self.thumbCanvas.getWidth()/2,
          top: obj.aCoords.br.y + 30,
          fontFamily: _font,
          // fontSize: 7,
          'originX': 'center',
          'originY': 'center'
        });
        __self.applyFontStyle(__self.fontFamily[__self.fontIndex], 'direct', text);
        __self.thumbCanvas.add(obj).renderAll(); 
        var _fontScale = (__self.thumbCanvas.width-200) / text.width;
        text.set('fontSize', text.fontSize * _fontScale);
        text.set('fill', textColor);
        __self.thumbCanvas.add(text); 
        var _sloganHieght;
        if(text.aCoords.br.y >= __self.thumbCanvas.height) {
          _sloganHieght = __self.thumbCanvas.height-30;
        }
        else {
          _sloganHieght = text.aCoords.br.y+10;
        }
        var text_1 = new fabric.Text("Slogan Here", {
          left: __self.thumbCanvas.getWidth()/2,
          top: _sloganHieght,
          fontFamily: "Cantora One",
          fontSize: 3,
          'originX': 'center',
          'originY': 'center'
        });
        __self.applyFontStyle({family: "Cantora One"}, 'direct', text_1);
        var _fontScale = (__self.thumbCanvas.width-250) / text_1.width;
        var num = _fontScale.toString();
        num = num.slice(0, (num.indexOf(".")+2));
        _fontScale = Number(num);
        text_1.set('fontSize', (text_1.fontSize * _fontScale));
        var blackAndWhiteComb = ["rgb(255,255,255)", "#ffffff", "rgb(0,0,0)", '#000000']; 
        if(blackAndWhiteComb.indexOf(__self.thumbCanvas.backgroundColor) != -1) {
          text_1.set('fill', __self.createMonoColors(__self.thumbCanvas.backgroundColor));
        }
        __self.thumbCanvas.add(text_1); 
        __self.logos[index].canvas = __self.thumbCanvas;
        __self.logos[index].text = _text;
        __self.logos[index].textColor = text.fill;
        __self.logos[index].sloganColor = text_1.fill;
        __self.logos[index].lazyLoad = false;
        __self.logos[index].fontFamily = text.fontFamily;
        __self.logos[index].fontFamily_1 = text_1.fontFamily;
        __self.logos[index].strokeColor = text.stroke;
        __self.logos[index].svg = response;
        callback();
      });
    }, function(err){
      console.log(err);
    });
  }

  applyFontStyle(font, type, obj) { 
    var _self = this;
    var head = document.getElementsByTagName('head')[0];
    const link = document.createElement('link');
    link.id = font.family;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/css?family='+font.family;
    link.media = 'all';
    head.appendChild(link);
    var myfont = new FontFaceObserver(font.family)
    myfont.load()
    .then(function() { 
      if(type == 'direct') {
        obj.set("fontFamily", font.family);
      }
      else {
        _self.thumbCanvas.getActiveObject().set("fontFamily", font.family);
      }
      _self.thumbCanvas.requestRenderAll();
    }).catch(function(e) {
      console.log(e) 
    }); 
  }

  downloadThumb(index) {
    if(this.logos[index].canvas) {
      var canvas = this.logos[index].canvas;
      var blob;
      blob = this.dataURLtoBlob(canvas.toDataURL('image/png'));
      const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
      a.href = URL.createObjectURL(blob);
      a.download = "Untitled";
      document.body.appendChild(a);
      a.click();        
      document.body.removeChild(a);
      URL.revokeObjectURL(blob);
    }
  }

  dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }
  

  getGoogleFonts() {
    this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBKL4h8YmvTbRg9qLjh7yOwBKfB1srshJI').subscribe((responseData: any) => {
      this.fontFamily = responseData.items;
    })
  }
  
  rgbTohex(color) {
    var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
    return "#" + arr.slice(0, 3).map(toHex).join("");
      /* return {
          hex: "#" + arr.slice(0, 3).map(toHex).join(""),
          opacity: arr.length == 4 ? arr[3] : 1
      }; */
      function toHex(int) {
          var hex = int.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
      }
  }

  invertColors(hex) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        /* throw new Error('Invalid HEX color.'); */
        return hex;
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
  
    function padZero(str) {
      var len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }
  }

  createMonoColors(_colors) {
      var textColor;
      if(!_colors.id && _colors.indexOf('rgb') != -1) {
        textColor = this.invertColors(this.rgbTohex(_colors));
      }
      if(_colors.type && _colors.type.indexOf('linear') != -1) {
        if(_colors.colorStops[0] && _colors.colorStops[0].color.indexOf('rgb') != -1) {
          textColor = this.invertColors(this.rgbTohex(_colors.colorStops[0].color));
        }
        else {
          textColor = "#00000";
        }
      }
      else {
        if(_colors == "rgb(0,0,0)") {
          textColor = this.invertColors(this.rgbTohex(_colors));
        }
        else if(_colors == "#00000") {
          textColor = this.invertColors("#000000");
        }
        else if(_colors.indexOf('rgb') == -1){
          textColor = this.invertColors(_colors);
        }
      }
      return textColor;
  }

}
