
var animationWriter;
var quizWriter;
var character;
var isCharVisible;
var isOutlineVisible;

function updateCharacter() {
  $('#animation-target').html('');
  $('#quiz-target').html('');

  //var character = $('#character-select').val();
  var character = currentHanzi;
  $('.char-symbol').text(character);
  animationWriter = HanziWriter.create('animation-target', character, {
    width: 300,
    height: 300,
    showOutline: shouldShowOutline('animation'),
    showCharacter: false,
    radicalColor: '#32CD32', // 部首green
    strokeAnimationSpeed: 0.5, // 5x normal speed
    delayBetweenStrokes: 500 // milliseconds
  }); 

  quizWriter = HanziWriter.create('quiz-target', character, {
    width: 300,
    height: 300,
    showOutline: shouldShowOutline('quiz'),
    showCharacter: false,
    showHintAfterMisses: 1,
    drawingWidth:50,  //绘制线条的宽度
    drawingColor:'#00FFFF',//绘制线条的颜色
    strokeColor: '#FF6A6A' // 浅红色
  });
  quizWriter.quiz();

  // for easier debugging
  window.animationWriter = animationWriter;
  window.quizWriter = quizWriter;
}

function shouldShowOutline(demoType) {
  return $('#' + demoType + '-show-outline').prop('checked');
}

$(function() {
  updateCharacter();

  $('.js-char-form').on('submit', function(evt) {
    evt.preventDefault();
    updateCharacter();
  });

  $('#animate').on('click', function(evt) {
    evt.preventDefault();
    animationWriter.animateCharacter();
  });
  $('#quiz-reset').on('click', function(evt) {
    evt.preventDefault();
    quizWriter.quiz();
  });

  $('#animation-show-outline').on('click', function() {
    var method = shouldShowOutline('animation') ? 'showOutline' : 'hideOutline';
    animationWriter[method]();
  });
  $('#quiz-show-outline').on('click', function() {
    var method = shouldShowOutline('quiz') ? 'showOutline' : 'hideOutline';
    quizWriter[method]();
  });
});


/*
// 定义全局变量用于存储当前点击按钮对应的汉字
let currentHanzi = '';

// 获取页面中的相关元素
const inputHanzi = document.getElementById('input-hanzi');
const createButtons = document.getElementById('create-buttons');
const buttonContainer = document.getElementById('button-container');
const currentHanziDisplay = document.getElementById('current-hanzi-display');

// 为生成按钮添加点击事件监听器
createButtons.addEventListener('click', () => {
  const hanziArray = inputHanzi.value.trim().split('');
  buttonContainer.innerHTML = ''; // 清空按钮容器内容，防止重复添加

  // 遍历输入的每个汉字，创建对应的按钮并添加到容器中
  hanziArray.forEach((hanzi) => {
    const button = document.createElement('button');
    button.className = 'hanzi-button';
    button.textContent = hanzi;

    button.addEventListener('click', () => {
      currentHanzi = hanzi;
      currentHanziDisplay.textContent = `当前选中的汉字：${currentHanzi}`;
      const utterance = new SpeechSynthesisUtterance(hanzi);
      window.speechSynthesis.speak(utterance);
      updateCharacter();
    });
    buttonContainer.appendChild(button);
  });
});
*/
// 定义全局变量用于存储当前点击按钮对应的汉字
let currentHanzi = '';
// 用于标记语音功能是否可用，初始化为false
let speechSupported = false;

// 等待页面DOM结构加载完成后再执行后续代码，避免找不到元素的情况
document.addEventListener('DOMContentLoaded', () => {
    // 获取页面中的相关元素
    const inputHanzi = document.getElementById('input-hanzi');
    const createButtons = document.getElementById('create-buttons');
    const buttonContainer = document.getElementById('button-container');
    const currentHanziDisplay = document.getElementById('current-hanzi-display');

    // 检查元素是否成功获取到，如果有元素获取失败则不添加点击事件监听器
    if (inputHanzi && createButtons && buttonContainer && currentHanziDisplay) {
        // 检查浏览器是否支持语音合成功能，并处理语音权限相关问题，只检查一次
        if ('speechSynthesis' in window) {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
              speechSupported = true;
          } else {
              console.log('语音功能正在加载，请稍后再试，或检查浏览器语音权限设置');
          }
        } else {
          console.log('当前浏览器不支持语音合成功能');
        }
      
      // 为生成按钮添加点击事件监听器
        createButtons.addEventListener('click', () => {
            const hanziArray = inputHanzi.value.trim().split('');
            buttonContainer.innerHTML = ''; // 清空按钮容器内容，防止重复添加

            // 遍历输入的每个汉字，创建对应的按钮并添加到容器中
            hanziArray.forEach((hanzi) => {
                const button = document.createElement('button');
                button.className = 'hanzi-button';
                button.textContent = hanzi;

                button.addEventListener('click', () => {
                    currentHanzi = hanzi;
                    currentHanziDisplay.textContent = `当前选中的汉字：${currentHanzi}`;

                    // 根据语音功能是否可用决定是否执行语音合成操作
                    if (speechSupported) {
                        const utterance = new SpeechSynthesisUtterance(hanzi);
                        const voices = window.speechSynthesis.getVoices();
                        // 设置语音相关属性，比如语音、语速、语调等（可根据需求调整）
                        utterance.voice = voices[0];
                        utterance.rate = 1;
                        window.speechSynthesis.speak(utterance);
                    } 

                    // 这里假设updateCharacter是一个自定义函数，用于展示汉字笔顺等相关操作
                    // 如果该函数不存在或者执行出错，添加错误处理逻辑
                    try {
                        updateCharacter();
                    } catch (error) {
                        console.error('在执行updateCharacter()函数时出现错误：', error);
                    }
                });
                buttonContainer.appendChild(button);
            });
        });
    }
});