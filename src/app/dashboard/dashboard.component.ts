import { Component, OnInit } from '@angular/core';  
import { Router } from '@angular/router';
import {UserService} from '../shared/user.service';
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver'
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
  showLoader=false;
  constructor(private router: Router, private userService: UserService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUserProfile(); 
    this.getGoogleFonts();
    this.logos.push({
      id: 'logoContainer_0',
      text: 'Logomaker'
    })
  }

  goToEditor(selectedlogo, index) {
    console.log(selectedlogo);

    localStorage.setItem('selectedLogo', JSON.stringify(this.logos[index]));
    this.router.navigate(['/editorhome']);
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
      width: 312,
      height: 212
    });
    
  }

  createLogos() {
    var _self = this;
    this.logos = [];
    this.getSearchIcons(null, function() {
      function createDynamiCanvas() {
        var i=0;
        function _asyncCanvas(key, svgUrl) {
          if(key == _self.svgUrl.length) {
            return;
          }
          _self.thumbCanvas = new fabric.StaticCanvas('logoContainer_'+key, {
            selection: true,
            selectionBorderColor: 'blue',
            backgroundColor: 'rgb(255,255,255)',
            width: 373,
            height: 272
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
        'authorization': 'Bearer gstjVMDz6rOIMhbqncn5MvvBYL1f9GUy9cJayjzqLfNE3halF28u5U0GkSIDkI32', 
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
          'text': this.iconName
        });
      }
      setTimeout( () => {
        this.showLoader=false;
        callback();
      })
    });
  }

  getSvgIcon(data,index, callback) { 
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
        'authorization': 'Bearer 4Lb0OMq5DBI4t9qEWYNS0Zzhg47Tuye5rPSZSgmjhVPoeKXeDFOyzgUqB7WrjNN0',
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
        var widRatio = (__self.thumbCanvas.getWidth() -200) /obj.width;
        var heiRatio = (__self.thumbCanvas.getHeight() - 200 )/obj.height;
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
        var _text = __self.iconName;
        var _font = "Cantora One";
        var text = new fabric.Text(_text, {
          left: __self.thumbCanvas.getWidth()/2,
          top: obj.aCoords.br.y + 30,
          fontFamily: _font,
          fontSize: 7,
          'originX': 'center',
          'originY': 'center'
        });
        __self.applyFontStyle(__self.fontFamily[__self.fontIndex], 'direct', text);
        __self.thumbCanvas.add(obj).renderAll(); 
        var _fontScale = (__self.thumbCanvas.width-250) / text.width;
        text.set('fontSize', text.fontSize * _fontScale);
        if(_colors && _colors[0]) {
          text.set('fill', _colors[1]);
          text.set('stroke', _colors[1]);
        }
        text.set('strokeWidth', 1);
        __self.thumbCanvas.add(text); 
        var text_1 = new fabric.Text("Slogan Here", {
          left: __self.thumbCanvas.getWidth()/2,
          top: text.aCoords.br.y + 30,
          fontFamily: _font,
          fontSize: 3,
          'originX': 'center',
          'originY': 'center'
        });
        __self.applyFontStyle(__self.fontFamily[__self.fontIndex], 'direct', text_1);
        var _fontScale = (__self.thumbCanvas.width-250) / text_1.width;
        var num = _fontScale.toString();
        num = num.slice(0, (num.indexOf(".")+2));
        _fontScale = Number(num);
        text_1.set('fontSize', (text_1.fontSize * _fontScale));
       /*  if(_colors && _colors[2]) {
          text_1.set('fill', _colors[2]);
        } */
        __self.thumbCanvas.add(text_1); 
        if(_colors&&_colors[3] && text.fill != _colors[3]) {
          __self.thumbCanvas.backgroundColor =_colors[3];
        }
        __self.logos[index].textColor = text.fill;
        __self.logos[index].text_1Color = text_1.fill;
        __self.logos[index].fontFamily = text_1.fontFamily;
        __self.logos[index].strokeColor = text.stroke;
        __self.logos[index].svg = response;
        __self.logos[index].backgroundColor = __self.thumbCanvas.backgroundColor;
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

  getGoogleFonts() {
    this.http.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBKL4h8YmvTbRg9qLjh7yOwBKfB1srshJI').subscribe((responseData: any) => {
      this.fontFamily = responseData.items;
    })
  }  

}
