"use strict";document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("toggle-btn"),t=document.querySelector(".side-navbar"),r=document.querySelector(".page"),s=document.querySelectorAll(".side-navbar .heading"),l=document.querySelector(".navbar.fixed-top");e&&e.addEventListener("click",(e=>{e.preventDefault(),window.outerWidth>1194?(t.classList.toggle("shrink"),r.classList.toggle("active"),l.classList.toggle("active"),s.forEach((e=>{e.classList.toggle("mx-lg-2")}))):(t.classList.toggle("show-sm"),l.classList.toggle("active-sm"))})),window.addEventListener("resize",(function(){ try{ this.outerWidth>1194?(t.classList.remove("show-sm"),r.classList.remove("active"),l.classList.remove("active-sm")):(t.classList.remove("shrink"),r.classList.remove("active"),l.classList.remove("active"))}catch(e){console.log(e)}}));[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')).map((function(e){return new bootstrap.Tooltip(e)}));let a=document.querySelectorAll("input.input-material");document.querySelectorAll("label.label-material");function i(e,t){e.forEach((e=>{e.classList.contains("js-validate-error-field")?(e.classList.add("is-invalid"),e.classList.remove("is-valid")):(e.classList.remove("is-invalid"),e.classList.add("is-valid"))}))}Array.from(a).filter((function(e){return""!==e.value})).forEach((e=>e.parentElement.lastElementChild.setAttribute("class","label-material active"))),a.forEach((e=>{e.addEventListener("focus",(function(){e.parentElement.lastElementChild.setAttribute("class","label-material active")}))})),a.forEach((e=>{e.addEventListener("blur",(function(){""!==e.value?e.parentElement.lastElementChild.setAttribute("class","label-material active"):e.parentElement.lastElementChild.setAttribute("class","label-material")}))}));let n=document.querySelector(".login-form");n&&new window.JustValidate(".login-form",{rules:{loginUsername:{required:!0,email:!0},loginPassword:{required:!0}},messages:{loginUsername:"Please enter a valid email",loginPassword:"Please enter your password"},invalidFormCallback:function(){let e=document.querySelectorAll(".login-form input[required]");i(e),n.addEventListener("keyup",(()=>i(e)))}});let o=document.querySelector(".register-form");o&&new window.JustValidate(".register-form",{rules:{registerUsername:{required:!0},registerEmail:{required:!0,email:!0},registerPassword:{required:!0},registerAgree:{required:!0}},messages:{registerUsername:"Please enter your username",registerEmail:"Please enter a valid email address",registerPassword:"Please enter your password",registerAgree:"Your agreement is required"},invalidFormCallback:function(){let e=document.querySelectorAll(".register-form input[required]");i(e),o.addEventListener("keyup",(()=>i(e))),o.addEventListener("change",(()=>i(e)))}});const c=document.querySelector(".profile-country-choices");if(c){new Choices(c,{searchEnabled:!1,placeholder:!1,callbackOnInit:()=>function(e){let t=e.dataset.customclass.split(" ");e.parentElement.classList.add.apply(e.parentElement.classList,t)}(c)})}document.querySelectorAll(".external").forEach((e=>{e.addEventListener("click",(function(t){t.preventDefault(),window.open(e.getAttribute("href"))}))}));const d=document.querySelector(".msnry-grid");if(d){var u=new Masonry(d,{percentPosition:!0});imagesLoaded(d).on("progress",(function(){u.layout()}))}OverlayScrollbars(document.querySelector(".side-navbar"),{overflowBehavior:{x:"hidden"}})}));
