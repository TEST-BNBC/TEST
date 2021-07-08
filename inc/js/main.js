"use strict";
$.fn.select2.amd.define("select2/i18n/ru",[],function(){return{errorLoading:function(){return"Результат не может быть загружен."},inputTooLong:function(n){var u=n.input.length-n.maximum,t="Пожалуйста, удалите "+u+" символ";return u>=2&&u<=4?t+="а":u>=5&&(t+="ов"),t},inputTooShort:function(n){return"Пожалуйста, введите "+(n.minimum-n.input.length)+" или более символов"},loadingMore:function(){return"Загружаем ещё ресурсы…"},maximumSelected:function(n){var u="Вы можете выбрать "+n.maximum+" элемент";return n.maximum>=2&&n.maximum<=4?u+="а":n.maximum>=5&&(u+="ов"),u},noResults:function(){return"Ничего не найдено"},searching:function(){return"Поиск…"}}});

Object.defineProperty(Object.prototype,"randElement",{value:function(){let t=this[Math.floor(Math.random()*this.length)];var e=this.indexOf(t);return e>-1&&this.splice(e,1),t}});

var _t = {
	time : null,
	currentItem : null,
	questions : [],
	test : {},
	counter : 0,
	result : {},
	clients : () => {
		for (let i in clients) {
			let o = clients[i];
			$('[name="test-member"]').append(`<option value="${i}">${o.fio}</option>`)
		}
	},
	makeTest : () => {
		_t.test.low = Object.values(test.low);
		_t.test.medium = Object.values(test.medium);
		_t.test.high = Object.values(test.high);
		for(let i = 0; i < 10; i++){
			_t.questions.push(_t.test.low.randElement());
		}	
		for(let i = 0; i < 8; i++){
			_t.questions.push(_t.test.medium.randElement());
		}
		for(let i = 0; i < 2; i++){
			_t.questions.push(_t.test.high.randElement());
		}		
		_t.questions = _t.questions
		  .map((a) => ({sort: Math.random(), value: a}))
		  .sort((a, b) => a.sort - b.sort)
		  .map((a) => a.value);
		_t.counter = 0;
	},
	timer : null,
	timerStart : () => {
		_t.timer = setInterval(function () {
			let seconds = _t.time%60;
			let minutes = _t.time/60%60;
			if (_t.time <= 0) {					
				clearInterval(_t.timer);
				alert(`Время закончилось, Вы набрали ${_t.result.points} баллов!`);
			} else {
				if(seconds < 10)
					seconds = '0' + seconds;
				
				minutes = Math.trunc(minutes);
				if(minutes < 10)
					minutes = '0' + minutes;
				
				let strTimer = `${minutes}:${seconds}`;			
				$('.timer-box').html(strTimer);
			}
			--_t.time;
		}, 1000);
	},
	Testinit : () => {
		_t.makeTest();
		
		_t.currentItem = 0;
		_t.time = 1800;		
		_t.result = {
			fio  : clients[$('[name="test-member"]').val()].fio,
			stat : [],
			points : 0,
			time : null
		};
		
		$('.test-fio-box').html(`Тестирование для: <b>${_t.result.fio}</b>`);
		
		$('.widjet-area-step-1').fadeToggle(400, () => {
			$('.widjet-area-step-2').fadeToggle(400, () => {
				$('.widjet-area-step-1').addClass("hidden");
				$('.widjet-area-step-2').removeClass("hidden");
				$('.test-init')[0].removeAttribute('disabled');
			});
		});
		_t.getNext();
		_t.timerStart();
	},
	getNext: () => {
		if(!_t.questions[_t.counter]){
			_t.getResults();
			return false;
		}
		
		if(_t.counter > 0){
			$('.variant-item.active').each((k,v) => {
				console.log(_t.questions[_t.counter - 1].result);
				console.log($(v).attr('data-el'));
				console.log()
				if(+_t.questions[_t.counter - 1].result - +$(v).attr('data-el') == 0){
					console.log('есть');
					_t.result.points = +_t.result.points + _t.questions[_t.counter].cost;
				}
			});
		}
		
		let q = _t.questions[_t.counter];
		$('.quest-box-text').html(q.question);
		$('.quest-variants-box').removeClass('text image').addClass(q.type);
		$('.quest-variants-box').html('');
		for(let i in q.variants){
			if(q.type == 'text'){
				$('.quest-variants-box').append(`<div data-el="${i}" class="variant-item">${q.variants[i]}</div>`)
			}else{
				$('.quest-variants-box').append(`<div data-el="${i}" class="variant-item"><img src="${q.variants[i]}" /></div>`)
			}	
		}
		_t.counter++;
	},
	getResults: () => {
		clearInterval(_t.timer);
		alert(`Тест пройден на ${_t.result.points} баллов!`);
	}
}

_t.clients();


$(document).ready(() => {	
	$('select').select2({
		language: "ru"
	});
	
	$(document).on('click', '.getAnswer', (e) => {
		if($('.variant-item.active').length < 1){
			alert('Выберите ответ!');
			return false;
		}
		_t.getNext();
		return false;
	});
	
	$(document).on('click', '.variant-item', (e) => {
		$('.variant-item').removeClass('active');
		$(e.currentTarget).toggleClass('active');
		
		return false;
	});
	
	$(document).on('click', '.test-init', (e) => {
		$(e.currentTarget).attr('disabled', 'disabled');
		if($('[name="test-member"]').val() == '' || $('[name="test-member"]').val().length < 0){
			alert('Выберите участника теста!');
			$(e.currentTarget)[0].removeAttribute('disabled');
			return false;
		}
		_t.Testinit();
		return false;
	});
	
	$(document).on('click', '[disabled="diabled"]', () => {return false});
});
