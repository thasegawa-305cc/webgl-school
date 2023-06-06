import * as THREE from "../lib/three.module.js";
import { OrbitControls } from "../lib/OrbitControls.js";

window.addEventListener(
  "DOMContentLoaded",
  () => {
    const app = new App3();
    app.init();
    app.render();
  },
  false
);

class App3 {
  // カメラ設定
  static get CAMERA_PARAM() {
    return {
      fovy: 60,
      aspect: window.innerWidth / window.innerHeight,
      near: 0.1,
      far: 100.0,
      x: 0.0,
      y: 2.0,
      z: 10.0,
      lookAt: new THREE.Vector3(0.0, 0.0, 0.0),
    };
  }
  // レンダラー設定
  static get RENDERER_PARAM() {
    return {
      clearColor: 0xd8eaea,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  // ディレクショナルライト設定
  static get DIRECTIONAL_LIGHT_PARAM() {
    return {
      color: 0xf5fcfc,
      intensity: 0.2,
      x: 1.0,
      y: 1.0,
      z: 1.0,
    };
  }
  // アンビエントライト設定
  static get AMBIENT_LIGHT_PARAM() {
    return {
      color: 0xf5fcfc,
      intensity: 0.98,
    };
  }

  // コンストラクタ
  constructor() {
    this.renderer;
    this.scene;
    this.camera;
    this.directionalLight;
    this.ambientLight;
    this.material;
    this.boxArray;
    this.controls;
    this.angle;

    // this固定
    this.render = this.render.bind(this);

    // リサイズイベント
    window.addEventListener(
      "resize",
      () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
      },
      false
    );
  }

  // 初期化処理
  init() {
    // レンダラー
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(
      new THREE.Color(App3.RENDERER_PARAM.clearColor)
    );
    this.renderer.setSize(
      App3.RENDERER_PARAM.width,
      App3.RENDERER_PARAM.height
    );
    const wrapper = document.querySelector("#webgl");
    wrapper.appendChild(this.renderer.domElement);

    // シーン
    this.scene = new THREE.Scene();

    // カメラ
    this.camera = new THREE.PerspectiveCamera(
      App3.CAMERA_PARAM.fovy,
      App3.CAMERA_PARAM.aspect,
      App3.CAMERA_PARAM.near,
      App3.CAMERA_PARAM.far
    );
    this.camera.position.set(
      App3.CAMERA_PARAM.x,
      App3.CAMERA_PARAM.y,
      App3.CAMERA_PARAM.z
    );
    this.camera.lookAt(App3.CAMERA_PARAM.lookAt);

    // ディレクショナルライト
    this.directionalLight = new THREE.DirectionalLight(
      App3.DIRECTIONAL_LIGHT_PARAM.color,
      App3.DIRECTIONAL_LIGHT_PARAM.intensity
    );
    this.directionalLight.position.set(
      App3.DIRECTIONAL_LIGHT_PARAM.x,
      App3.DIRECTIONAL_LIGHT_PARAM.y,
      App3.DIRECTIONAL_LIGHT_PARAM.z
    );
    this.scene.add(this.directionalLight);

    // アンビエントライト
    this.ambientLight = new THREE.AmbientLight(
      App3.AMBIENT_LIGHT_PARAM.color,
      App3.AMBIENT_LIGHT_PARAM.intensity
    );
    this.scene.add(this.ambientLight);

    // マテリアル
    this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    // ジオメトリ
    this.boxGeometry = new THREE.BoxGeometry(0.7, 0.7, 0.7);

    const BOX_COUNT = 100;
    const TRANSFORM_SCALE = 8.0;
    const MOTION_TYPE = ["rotation", "vertical"]; // 動きのパターン
    const motionLength = MOTION_TYPE.length;
    this.boxArray = [];
    this.angle = 0;
    for (let i = 0; i < BOX_COUNT; ++i) {
      const box = new THREE.Mesh(this.boxGeometry, this.material);
      box.position.x = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
      box.position.y = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;
      box.position.z = (Math.random() * 2.0 - 1.0) * TRANSFORM_SCALE;

      // 動きのパターン
      const motion = MOTION_TYPE[Math.floor(Math.random() * motionLength)];
      const random = Math.random();
      console.log("motion", motion);
      this.boxArray.push({ box: box, motion: motion, random: random });

      this.scene.add(box);
    }

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ヘルパー
    const axesBarLength = 5.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);
  }

  // 描画処理

  render() {
    requestAnimationFrame(this.render);
    this.controls.update();

    this.boxArray.forEach((item) => {
      const box = item.box;
      const motion = item.motion;
      const random = item.random;
      // 回転
      if (motion === "rotation") {
        box.rotation.y += (random * 2.0 - 1.0) * 0.1;
      } else if (motion === "vertical") {
        // 上下
        const newAngle = random * this.angle;
        box.position.y += Math.sin(newAngle) * (random * 0.2 - 0.1);
      }
    });
    this.angle += 0.015;
    this.renderer.render(this.scene, this.camera);
  }
}
