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
      y: 0.0,
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
    this.controls;
    this.featherGroup;

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
    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    // 羽グループ
    this.featherGroup = new THREE.Group();
    this.featherGroup.position.y = 1.5;
    this.scene.add(this.featherGroup);

    // 羽
    const FEATER_WIDTH = 0.5; // 幅
    const GEATER_HEIGHT = 1.2; // 高さ
    const featherGeometry = new THREE.PlaneGeometry(
      FEATER_WIDTH,
      GEATER_HEIGHT
    );
    const distance =
      (Math.tan(((108 / 2) * Math.PI) / 180) * FEATER_WIDTH) / 2 +
      GEATER_HEIGHT / 2;
    console.log("dis", distance);
    for (let i = 0; i < 5; i++) {
      const feather = new THREE.Mesh(featherGeometry, this.material);
      const group = new THREE.Group();
      feather.position.y = distance;

      group.add(feather);
      group.rotation.z = ((Math.PI * 2) / 5) * i;

      this.featherGroup.add(group);
    }

    // ポール
    const poleGeometry = new THREE.CylinderGeometry(0.1, 0.2, 3.0, 5);
    const pole = new THREE.Mesh(poleGeometry, this.material);
    pole.position.z = -0.3;
    this.scene.add(pole);

    // コントロール
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // ヘルパー
    const axesBarLength = 1.0;
    this.axesHelper = new THREE.AxesHelper(axesBarLength);
    this.scene.add(this.axesHelper);
  }

  // 描画処理

  render() {
    requestAnimationFrame(this.render);
    this.controls.update();
    this.featherGroup.rotation.z -= 0.1;
    this.renderer.render(this.scene, this.camera);
  }
}
