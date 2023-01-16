import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');


let loadInterval;

//loader
function loader(element){
  element.textContent = '';
  loadInterval = setInterval(()=> {
    element.textContent += '.';

    if(element.textContent === '....'){
      element.textContent = '';
    }
  } , 300);
}

//text written on screen one by one
function typeText(element , text){
  let index = 0;
  let interval = setInterval(()=>{
    if( index < text.length ){
      element.innerHTML += text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval); 
    }
  },20);
}

//Generating new ID
function generateUniqueId(){
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}


//messages show
function chatStripe( isAi , value , uniqueId ){
  return(
    `
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img 
              src="${isAi ? bot : user}"
              alt="${isAi ? 'bot' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId} >${value}</div>
        </div>
      </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  //user's chat
  chatContainer.innerHTML += chatStripe(false , data.get('prompt'));
  // console.log(chatContainer.innerHTML);

  form.reset();

  //bot's chat

  const uniqueId = generateUniqueId();

  chatContainer.innerHTML += chatStripe(true , " ", uniqueId );
  
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);

  loader(messageDiv);

  //fetch realtime data

  const response = await fetch('https://gpt-server-production.up.railway.app/', {
    method: 'POST',
    headers:{
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    }),
  });
 clearInterval(loadInterval);
 messageDiv.innerHTML = ' ';

 if(response.ok){
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv , parsedData);
  }
  else{
    const err = await response.text();
    messageDiv.innerHTML = "Something went wrong , plz try again";
    alert(err);
  }
}


form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13){
    handleSubmit(e);
  }
});

