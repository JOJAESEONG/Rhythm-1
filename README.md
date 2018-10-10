# NMS Web Service
이 문서는 NMS 웹 서버의 구성에 대한 이해를 돕기위해 작성하며 디렉토리 구조 및 주요 파일들의 역할에 대해서 서술한다.
전체적으로 최적화되지 않은 서비스 및 코드로, 기존의 코드를 최대한 보존한 상태에서 MongoDB에 저장된 documents를 디스플레이하는 코드를 추가하였다.
디자인과 인증에 대한 코드 분석 및 언급은 하지 않는다.

> 화면 구성 및 동작 방식에 대한 세밀한 정의가 필요함.

## Directory Structure
```
webserver/
├── app.js
├── dataReceiver.js
├── bin
│   └── www
├── lib
│   └── io_eventHandler.js
├── models
│   ├── lora.js
│   ├── pi.js
│   └── web.js
├── routes
│   ├── comparison.js
│   └── index.js
└── viewsa
   ├── index.ejs
   └── contents
	   └── comparison.ejs
```

## Procedure
프로그램의 실행 순서 측면에서 보면 다음과 같이 파일들이 순차적으로 호출된다고 생각하면 편하다.

![call hierarchy](https://cl.ly/2a1616/Image%202018-10-03%20at%2012.41.57%20AM.png)
	
__www__는 먼저 express를 이용한 웹 서버를 동작시키기 위한 __app__을 호출한다. 
이후 __app__은 __dataReceiver__를 호출하고, __www__는 이에 대응하는 __io\_eventHandler__를 각각 호출한다. 
__dataReceiver__는 __pi__, __web__, __lora__를 이용하여 _MongoDB_에 접근하여 가장 최신 데이터를 5초 간격으로 가져온다.
이 데이터들은 `socket.emit()` 함수를 통해 _websocket_으로 전달되고, __io\_eventHandler__가 이 데이터를 받아서 연결된 모든 클라이언트로 브로드캐스팅하는 `socket.broadcast.emit()` 함수를 호출한다.  
routes/__index__는 express의 라우팅 역할을 수행한다. _이 기본 라우팅 파일은 /comparison_ 페이지로 요청이 오면 views/index.ejs 내부에 views/contents/comparison.ejs 코드를 삽입할 수 있도록 routes/__comparison__ 을 호출하여 content를 지정한다. 실제 코드 삽입은 views/index.ejs에서 include를 통해 이루어진다.
views/contents/comparison.js는 socket.io를 사용하여 __io\_eventHandler__가 브로드캐스팅하는 정보를 받아서 화면에 출력한다.

## 페이지 및 기능 추가 예제
![procedure](https://cl.ly/2bb832/Image%202018-10-03%20at%201.09.26%20AM.png)

1. routes/index 에 페이지 추가
```javascript
/* xxx 주소를 라우팅하기 위해 xxx(router)를 사용
app.use('/xxx', require('./xxx'));	
```

2. routes/xxx.js 파일 생성
```
const router = require('express').Router();	// 새로운 express 라우터 생성
router.get('/', (req, res) => {	
	res.render('index', {		// index 페이지를 렌더링
	  content: 'xxx'				// xxx 페이지를 컨텐트로 삽입
	});
});
module.exports = router;	// 생성한 express 라우터를 외부에서 호출할 수 있도록 설정
```

3. views/index.ejs 에서 contents/xxx.ejs 파일을 include 
```javascript
<% if(content == 'comparison') { %>
	<%- include ./contents/xxx %>
<% } %>
```

4. views/contents/xxx.ejs 파일 생성
원하는 화면을 출력할 웹 페이지 구성
