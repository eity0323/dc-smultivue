/**
 * @author liyang
 * @version 1.0.0
 * @description 用于初始化vue的
 */
import Vue from 'vue';
import App from './App.vue';
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
