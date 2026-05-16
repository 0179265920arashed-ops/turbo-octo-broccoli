(function() {
  // ১. শুধুমাত্র বোনাস পপ-আপ এবং ওয়ালেটের CSS ডিজাইন
  const style = document.createElement('style');
  style.textContent = `
    .bonus-popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: none; justify-content: center; align-items: center; z-index: 9999999; font-family: sans-serif; padding: 10px; }
    .dashboard-card, .custom-alert-card { width: 100%; max-width: 340px; background: #fff; border-radius: 24px; padding: 22px; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.4); box-sizing: border-box; }
    .internal-wallet { background: linear-gradient(135deg, #11998e, #38ef7d); color: #fff; padding: 15px; border-radius: 18px; margin-bottom: 15px; }
    .internal-wallet .w-balance { font-size: 28px; font-weight: bold; margin: 5px 0; }
    .dashboard-card input { width: 100%; padding: 12px; margin: 12px 0; border: 1px solid #ddd; border-radius: 12px; font-size: 16px; text-align: center; background: #f9f9f9; outline: none; box-sizing: border-box; }
    .btn-primary, .custom-alert-btn { background: #ff6b00; color: #fff; border: none; padding: 14px; font-size: 16px; font-weight: bold; border-radius: 12px; cursor: pointer; width: 100%; box-sizing: border-box; }
    .btn-secondary { background: #2a5298; color: #fff; border: none; padding: 14px; font-size: 16px; font-weight: bold; border-radius: 12px; cursor: pointer; width: 100%; margin-top: 10px; box-sizing: border-box; }
    .close-popup { position: absolute; top: -12px; right: -12px; font-size: 20px; cursor: pointer; color: #fff; background: #ff3d00; width: 32px; height: 32px; line-height: 28px; border-radius: 50%; font-weight: bold; box-shadow: 0 4px 10px rgba(0,0,0,0.3); text-align: center; border: 2px solid #fff; z-index: 10; }
    #spinSection { display: none; }
    .pointer { width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-top: 30px solid #ff0000; margin: auto; position: relative; z-index: 10; }
    #wheel { width: 230px; height: 230px; border-radius: 50%; margin: 15px auto; border: 6px solid orange; position: relative; overflow: hidden; transition: transform 4s cubic-bezier(.25,.1,.25,1); background: conic-gradient(#ff5252 0deg 51.4deg,#ffeb3b 51.4deg 102.8deg,#4caf50 102.8deg 154.2deg,#03a9f4 154.2deg 205.6deg,#9c27b0 205.6deg 257deg,#e91e63 257deg 308.4deg,#009688 308.4deg 360deg); }
    .wheelText span { position: absolute; left: 50%; top: 50%; transform-origin: 0 0; font-weight: bold; font-size: 14px; color: #fff; }
    #result { font-size: 20px; font-weight: bold; margin-top: 12px; }
    .custom-alert-card { display: none; }
    .money { position: fixed; font-size: 30px; pointer-events: none; z-index: 99999999; animation: mF 3s linear forwards; } @keyframes mF { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-500px) translateX(var(--x)) rotate(720deg); opacity: 0; } }
  `;
  document.head.appendChild(style);

  // ২. বোনাস পপ-আপের মেইন HTML বডি তৈরি
  const bonusDiv = document.createElement('div');
  bonusDiv.id = "bonusDashboardPopup";
  bonusDiv.className = "bonus-popup-overlay";
  bonusDiv.innerHTML = `
    <div class="dashboard-card" id="mainCardBody">
        <span class="close-popup" id="ffCloseBtn">&times;</span>
        <div id="walletSection">
            <div class="internal-wallet">
                <div style="font-size:14px;font-weight:bold">🎁 BONUS WALLET</div>
                <div class="w-balance"><span id="bonusBalDisplay">0.00</span> ৳</div>
            </div>
            <h4 style="margin:10px 0;color:#333;font-size:15px">টাকা মেইন ওয়ালেটে নিতে এখানে পরিমাণ লিখুন</h4>
            <p style="color:#ff3d00;font-size:12px;margin:0 0 10px 0;font-weight:bold;">⚠️ সর্বনিম্ন ৫ টাকা হলে উইথড্র করতে পারবেন</p>
            <input type="number" id="withdrawAmount" placeholder="টাকার পরিমাণ (সর্বনিম্ন ৫ Tk)" step="0.01">
            <button class="btn-primary" id="submitWithdraw">সাবমিট করুন</button>
            <hr style="border:0;border-top:1px solid #eee;margin:15px 0 10px 0">
            <div style="background:#fff3cd; border:1px solid #ffeeba; color:#856404; padding:12px; border-radius:12px; margin:0 0 12px 0; font-size:12.5px; font-weight:bold; line-height:1.4; text-align:left;">
                📢 <b>নোটিশ:</b> এই স্পিনটি খেলতে আপনার অ্যাকাউন্টে যেকোনো ন্যূনতম ৫টি সফল অর্ডার থাকতে হবে। <br><br>
                ✨ আপনার অ্যাকাউন্টে যদি ৫টি বা তার বেশি অর্ডার থেকে থাকে, তবে আপনি নিশ্চিন্তে লাকি স্পিন খেলে নিশ্চিত টাকা জিতে নিতে পারেন!
            </div>
            <button class="btn-secondary" id="goToSpinBtn">🎯 লাকি স্পিন খেলুন</button>
        </div>
        <div id="spinSection">
            <h3 style="margin:0;color:#333;font-size:20px;font-weight:bold;">ডেইলি লাকি স্পিন</h3>
            <div class="pointer" style="margin-top:10px;"></div>
            <div id="wheel">
                <div class="wheelText">
                    <span style="transform:rotate(25.7deg) translate(-15px, -85px)">৳0.10</span>
                    <span style="transform:rotate(77.1deg) translate(-15px, -85px)">৳0.20</span>
                    <span style="transform:rotate(128.5deg) translate(-15px, -85px)">৳0.50</span>
                    <span style="transform:rotate(180deg) translate(-15px, -85px)">৳1.00</span>
                    <span style="transform:rotate(231.4deg) translate(-15px, -85px)">৳5.00</span>
                    <span style="transform:rotate(282.8deg) translate(-15px, -85px)">৳10</span>
                    <span style="transform:rotate(334.2deg) translate(-15px, -85px)">৳50</span>
                </div>
            </div>
            <button class="btn-primary" id="spinBtn">SPIN NOW</button>
            <div id="result"></div>
            <button class="btn-secondary" id="backToWalletBtn" style="margin-top:10px;background:#777;font-size:14px;padding:10px">← ওয়ালেটে ফিরুন</button>
        </div>
    </div>
    <div class="custom-alert-card" id="customAlert">
        <h3>📢 সাবমিট সফল হয়েছে!</h3>
        <p id="alertMessageBody"></p>
        <button class="custom-alert-btn" id="ffAlertOkBtn">OK</button>
    </div>
  `;
  document.body.appendChild(bonusDiv);

  // ৩. স্পিন, ওয়ালেট ক্যালকুলেশন এবং বাটন ওপেন লজিক
  const mPopup=document.getElementById("bonusDashboardPopup"),mCard=document.getElementById("mainCardBody"),wSec=document.getElementById("walletSection"),sSec=document.getElementById("spinSection"),sBtn=document.getElementById("spinBtn"),wheel=document.getElementById("wheel"),res=document.getElementById("result"),sub=document.getElementById("submitWithdraw"),cAlert=document.getElementById("customAlert"),wAmt=document.getElementById("withdrawAmount");

  if(!localStorage.getItem("v2_clean_done")){
      localStorage.removeItem("totalBonusBalance");
      localStorage.removeItem("last_spin_date_secure");
      localStorage.setItem("v2_clean_done","true");
  }

  function upUI(){
      let b=parseFloat(localStorage.getItem("totalBonusBalance"))||0;
      document.getElementById("bonusBalDisplay").innerText=b.toFixed(2);
  }
  upUI();

  function closeAllPopups(){mPopup.style.display="none"}
  document.getElementById("ffCloseBtn").onclick = closeAllPopups;
  document.getElementById("ffAlertOkBtn").onclick = closeAllPopups;
  document.getElementById("goToSpinBtn").onclick=()=>{wSec.style.display="none";sSec.style.display="block"};
  document.getElementById("backToWalletBtn").onclick=()=>{sSec.style.display="none";wSec.style.display="block";upUI()};

  // কাস্টমারের নিজের বানানো বাটনে ক্লিক করলে পপ-আপ খোলার গ্লোবাল লিসেনার
  document.addEventListener("click", function(e) {
      let t = e.target.closest("a");
      if(t && t.getAttribute("href") === "#bonus-open") {
          e.preventDefault(); mPopup.style.display = "flex"; mCard.style.display = "block";
          cAlert.style.display = "none"; wSec.style.display = "block"; sSec.style.display = "none"; res.innerHTML = ""; upUI();
      }
  });

  sBtn.onclick=()=>{
      let todayDate = new Date().toISOString().slice(0, 10); 
      let lastSpinDate = localStorage.getItem("last_spin_date_secure");
      
      if(lastSpinDate === todayDate) {
          alert("⚠️ লিমিট শেষ! আপনি আপনার এই ডিভাইস থেকে আজকের মতো স্পিন খেলে ফেলেছেন। আগামীকাল আবার চেষ্টা করুন।");
          return;
      }

      sBtn.disabled = true;
      res.innerHTML = "...🎰...";
      
      const p=[0.1,0.2,0.5,1,5,10,50]; let i, r=Math.random()*100;
      if(r<50){i=1}else if(r<80){i=0}else if(r<95){i=2}else if(r<99.9){i=3}else{i=4}
      const a=p[i], t=360-(i*51.42)-25.7, rTot=2880+t; wheel.style.transform=`rotate(${rTot}deg)`;
      
      setTimeout(()=>{
          res.innerHTML=`🎉 You Won ৳${a.toFixed(2)}`; res.style.color="#00a86b"; mB();
          
          let c=parseFloat(localStorage.getItem("totalBonusBalance"))||0;
          localStorage.setItem("totalBonusBalance",(c+a).toFixed(2));
          localStorage.setItem("last_spin_date_secure", todayDate);
          
          sBtn.disabled = false;
          setTimeout(()=>{wheel.style.transition="none";wheel.style.transform=`rotate(${t}deg)`;setTimeout(()=>{wheel.style.transition="transform 4s cubic-bezier(.25,.1,.25,1)"},50)},1000);
      },4000);
  };

  sub.onclick=()=>{
      let v=parseFloat(wAmt.value);
      let b=parseFloat(localStorage.getItem("totalBonusBalance"))||0;
      
      if(isNaN(v)||v<=0){alert("⚠️ সঠিক পরিমাণ লিখুন।");return}
      if(v<5){alert("⚠️ দুঃখিত! সর্বনিম্ন ৫ টাকা না হলে সাবমিট করতে পারবেন না।");return}
      if(v > b){alert("⚠️ পর্যাপ্ত টাকা নেই!");return}
      
      let newBalance = (b - v).toFixed(2);
      localStorage.setItem("totalBonusBalance", newBalance);
      upUI();
      
      document.getElementById("alertMessageBody").innerHTML=`আপনি মেইন ওয়ালেটে নেওয়ার জন্য <b>৳${v.toFixed(2)}</b> সাবমিট করেছেন।<br><br>অনুগ্ৰহ করে পেজটির একটি স্ক্রিনশট তুলে হেল্পলাইনে কন্টাক্ট করুন।<br><br><b>📞 WhatsApp: 01340911285</b>`;
      mCard.style.display="none";cAlert.style.display="block";wAmt.value="";
  };

  function mB(){
      const e=["💸","💰","🪙","💵"];
      for(let i=0;i<20;i++){
          const m=document.createElement("div");m.className="money";m.innerText=e[Math.floor(Math.random()*e.length)];
          m.style.left=Math.random()*window.innerWidth+"px";m.style.bottom="0px";m.style.setProperty("--x",(Math.random()*400-200)+"px");
          document.body.appendChild(m);setTimeout(()=>m.remove(),3000);
      }
  }
})();
