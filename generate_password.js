const inputslider=document.querySelector("#volume");
const lengthdisplay = document.querySelector("[data-lengthnumber]");
const passworddisplay=document.querySelector("[data-password]");
const copymsg=document.querySelector("[data-copyMsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numberschecker=document.querySelector('#digit');
const symbolscheck=document.querySelector('#sym');
const indicator=document.querySelector('[data-indicator]');
const generatebtn=document.querySelector(".generateButton");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const copybtn = document.querySelector("[data-copy]");

const symbol1="@#$%^&*()_+[]{}|;:',.<>?/~`!"     // ye hmne symbol ki string bna li


let password="";  // starting ma password ki value empty ha to password ki value empty di ha
let passwordlength=10;   // starting ma password ki length 10 ha to hmne 10 di ha 
let checkcount=0;   


// handleslider();
function handleslider(){    // ye function password ki length ko set kar da ga
    inputslider.value=passwordlength;  // is sa slider ki position 10 par set hui ha jo default ha
    lengthdisplay.innerText = passwordlength;  // is sa jo lengthplay ki value 10 hui ha
}


function getrandomnumber(min,max){   // math.random sa koi bi random number generate ho jyega range (0-1) ka bich ma  isma 0 inclusive ha or 1 exclusive ha
   return  Math.floor(Math.random()*(max-min))+min;         // math.floor sa flot number nhi ayega only integer hi ayega
}


function generaterandomnumber(){
    return getrandomnumber(0,9);
}
function genertaelowercase(){
    return String.fromCharCode(getrandomnumber(97,123));
}

function generateuppercase(){   
   return String.fromCharCode(getrandomnumber(65,91));
}


function generatesymbol(){    // hm isma symbol ki string bna lenga usma sa random number generate kar lenga
    const a=getrandomnumber(0,symbol1.length);  // is sa random number generate hoga 
    return symbol1.charAt(a);    // is sa random number par jo symbol ha vo rturn hoga
}
function setindicator(color){    // is sa indicator ka color set ho jyega 
    indicator.style.backgroundColor = color;

    // shadow set karni ha 
}
function calculatestrength(){   // function ki strength ka liya function bnaya ha
    let hasupper=false;
    let haslowe=false;
    let hasnum=false;
    let hassym=false;
    if(uppercasecheck.checked) hasupper=true;
    if(lowercasecheck.checked) haslowe=true;
    if(numberschecker.checked) hasnum=true;
    if(symbolscheck.checked) hassym=true;
    if(hasupper && haslowe && hasnum && hassym && passwordlength>=8 ){
        setindicator("#0f0");
    }
    if((hasupper && haslowe) || (hasnum && hassym)){
        setindicator("#ff0");
    }
    else{
        setindicator("#f00");
    }
}

 async function copycontent(){    // ye ak async operation ha mtlab ki text copy ho bi sakta ha or nhi bi ho sakta isliya async operation ha
       try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copymsg.innerText="copied";  // ye functio isliya ha ki jab uper await vla promise return kar dega to copied msh seen ho jyega
        // is sa hm jase hi content copy ho jyega hm copy vla content dal dega copymsg vla address par
       }
       catch(e){
        copymsg.innerText="failed";
       }

       // to make copy wala span visible
       copymsg.classList.add("active");
       setTimeout(() => {
        copymsg.classList.remove("active");
    }, 2000);     

}


// slider par event listner lgana  jab slider hila ga to value change karna 
inputslider.addEventListener('input',(e) => {
    passwordlength=e.target.value;
    handleslider();
});

// copy btn par event listner lgana

copybtn.addEventListener('click', () =>{
    if(passworddisplay.value){   // iska mtlab ha yadhi passworddisplay vla content not empty ha to copycontent vla function call kar dena 
        copycontent();
    }
});

function handle(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkcount++;
        }
    });
    if(passwordlength<checkcount){
        passwordlength=checkcount;
        handleslider();
    }
}
// hme sare ka sare checkbox par event listner lgana padega kyoki hme track rakhna hoga kosa check box select ha konsa nhi ha 
allcheckbox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handle);
});


// generate password btn par event listener lgana
function shuffle(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
generatebtn.addEventListener('click' ,() => {
    // none of the checkbox is checked 
    if(checkcount<=0) return;  // yani ki koi bi  password nhi hoga generate 

    if(passwordlength < checkcount){
        passwordlength=checkcount;
        handleslider();
    }


    // let`s start thr journey to find new password

    //1 step jo phle password ha usko remove kar da
    password="";

    // if(uppercasecheck.checked){     // ase dalna shi nhi ha kyoki isma 4 hi char jyega hme ak array bnana padeha jisma ya sari value push kar dega
    //     password=password+generateuppercase();
    // }
    // if(lowercasecheck.checked){
    //     password=password+genertaelowercase();
    // }
    // if(numberschecker.checked){
    //     password=password+generaterandomnumber();
    // }
    // if(symbolscheck.checked){
    //     password=password+generatesymbol();
    // }
     
    let funarr=[];
    if(uppercasecheck.checked){
        funarr.push(generateuppercase);
    }
    if(lowercasecheck.checked){
        funarr.push(genertaelowercase);
    }
    if(numberschecker.checked){
        funarr.push(generaterandomnumber);
    }
    if(symbolscheck.checked){
        funarr.push(generatesymbol);
    }


    // compulasory addition
    for(let i=0;i<funarr.length;i++){
        password=password+funarr[i]();
    }
    console.log("complsure addition done")
   
    // remaining addition
    for(let i=0;i<passwordlength-funarr.length;i++){
        let randindex=getrandomnumber(0,funarr.length);
        password=password+funarr[randindex]();
    }  

    // shuffle the password
    password=shuffle(Array.from(password));  // password ko hmne array ma store karva ka baj diya
    console.log("shuffling done");
    // show in ui
    passworddisplay.value=password;
    // call the strenght function
    calculatestrength();
});



