const APP_KEY = "Please fill in your AdTiming app key";

cc.Class({
  extends: cc.Component,

  properties: {
    loggerScrollView: {
      default: null,
      type: cc.ScrollView,
    },
    loggerContent: {
      default: null,
      type: cc.Node,
    },
    loggerMask: {
      default: null,
      type: cc.Node,
    },

    placementIdEditBox: {
      default: null,
      type: cc.EditBox,
    },

    initBtn: {
      default: null,
      type: cc.Button,
    },
    showBannerAdBtn: {
      default: null,
      type: cc.Button,
    },
    changeBannerAdPosBtn: {
      default: null,
      type: cc.Button,
    },
    changeBannerAdVisibilityBtn: {
      default: null,
      type: cc.Button,
    },
    showRewardedVideoBtn: {
      default: null,
      type: cc.Button,
    },
    showInterstitialAdBtn: {
      default: null,
      type: cc.Button,
    },
  },

  onLoad() {
    this.logMsgId = 1;
    this.bannerAdPosition = "Top";

    // Just for debugging.
    AdTiming.setLogEnable(true);
    if (CC_EDITOR) {
      Editor.log("Please fill the AdTiming app key in main.js script");
    }
  },

  update(dt) {},

  log(msg) {
    if (this.loggerMask.opacity > 0) {
      this.loggerMask.opacity = 0;
    }

    const node = new cc.Node();
    node.width = this.loggerContent.width;

    const label = node.addComponent(cc.Label);
    label.string = `${this.logMsgId++}. ${msg}`;
    label.enableWrapText = true;
    label.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
    label.fontSize = 30;
    label.lineHeight = 35;

    this.loggerContent.addChild(node);
    this.loggerScrollView.scrollToBottom(0.5);

    cc.log(`AdTiming - ${msg}`);
  },

  onBannerAdPosChanged(event, position) {
    this.bannerAdPosition = position;
  },

  onInitBtnClicked() {
    if (AdTiming.isInitialized()) {
      this.log("SDK already initialized");
      return;
    }

    if (!this.sdkInitListenersAdded) {
      AdTiming.Events.addListener("sdkInitSuccess", () => {
        this.log("Initialize SDK success");

        const btnNames = [
          "showBannerAdBtn",
          "changeBannerAdPosBtn",
          "changeBannerAdVisibilityBtn",
          "showRewardedVideoBtn",
          "showInterstitialAdBtn",
        ];

        for (const btnName of btnNames) {
          const btn = this[btnName];
          btn.interactable = true;
          btn.node.opacity = 255;
        }
      });

      AdTiming.Events.addListener("sdkInitFailed", (error) => {
        this.log(`Initialize SDK failed - ${error}`);
      });

      this.sdkInitListenersAdded = true;
    }

    AdTiming.init(APP_KEY);
  },

  onShowBannerAdBtnClicked() {
    const placementId = this.getPlacementId();
    if (placementId.match(/^\s*$/)) {
      this.log("Please enter the placement ID");
      return;
    }

    if (!this.bannerAdListenersAdded) {
      this.addBannerAdListeners();
      this.bannerAdListenersAdded = true;
    }

    if (AdTiming.isBannerAdLoaded(placementId)) {
      this.log(`Banner Ad ${placementId} already loaded`);
      return;
    }

    this.log(`Loading banner Ad ${placementId}`);
    AdTiming.loadBannerAd(
      placementId,
      AdTiming.AdSize.Smart,
      this.getBannerAdPosition()
    );
  },

  onChangeBannerAdBtnPosClicked() {
    if (!this.checkBannerAdLoaded()) {
      return;
    }

    const placementId = this.getPlacementId();
    const bannerAdPosition = this.getBannerAdPosition();
    this.log(
      `Change the position of banner Ad ${placementId} to ${AdTiming.BannerAdPosition[bannerAdPosition]}`
    );
    AdTiming.changeBannerAdPosition(placementId, bannerAdPosition);
    this.log(
      `New position: ${
        AdTiming.BannerAdPosition[AdTiming.getBannerAdPosition(placementId)]
      }`
    );
  },

  onChangeBannerAdVisibilityBtnClicked() {
    if (!this.checkBannerAdLoaded()) {
      return;
    }

    const placementId = this.getPlacementId();
    if (!AdTiming.isBannerAdVisible(placementId)) {
      this.log(`Show banner Ad ${placementId}`);
      AdTiming.showBannerAd(placementId);
    } else {
      this.log(`Hide banner Ad ${placementId}`);
      AdTiming.hideBannerAd(placementId);
    }
  },

  onShowRewardedVideoBtnClicked() {
    if (!this.rewardedVideoListenersAdded) {
      this.addRewardedVideoListeners();
      this.rewardedVideoListenersAdded = true;
    }

    this.log("Show rewarded video...");

    if (AdTiming.isRewardedVideoReady()) {
      AdTiming.showRewardedVideo();
      this.rewardedVideoShowed = true;
    } else {
      this.log("Rewarded video not ready, please wait...");
    }
  },

  onShowInterstitialAdBtnClicked() {
    if (!this.interstitialAdListenersAdded) {
      this.addInterstitialAdListeners();
      this.interstitialAdListenersAdded = true;
    }

    this.log("Show interstitial Ad...");

    if (AdTiming.isInterstitialAdReady()) {
      AdTiming.showInterstitialAd();
      this.interstitialAdShowed = true;
    } else {
      this.log("Interstitial Ad not ready, please wait...");
    }
  },

  addBannerAdListeners() {
    AdTiming.Events.addListener("onBannerAdReady", (placementId) => {
      this.log(`Banner Ad ${placementId} is ready`);
    });

    AdTiming.Events.addListener("onBannerAdFailed", (placementId, msg) => {
      this.log(`Load banner Ad ${placementId} failed: ${msg}`);
    });

    AdTiming.Events.addListener("onBannerAdClicked", (placementId) => {
      this.log(`Banner Ad ${placementId} clicked`);
    });
  },

  addRewardedVideoListeners() {
    AdTiming.Events.addListener(
      "onRewardedVideoAvailabilityChanged",
      (available) => {
        this.log(`Rewarded video Ad availability changed: ${available}`);
        if (available && !this.rewardedVideoShowed) {
          AdTiming.showRewardedVideo();
          this.rewardedVideoShowed = true;
        }
      }
    );

    AdTiming.Events.addListener("onRewardedVideoAdShowed", (scene) => {
      this.log(`Rewarded video Ad showed, scene: ${scene}`);
    });

    AdTiming.Events.addListener(
      "onRewardedVideoAdShowFailed",
      (scene, error) => {
        this.log(
          `Rewarded video Ad show failed, scene: ${scene}, error: ${error}`
        );
      }
    );

    AdTiming.Events.addListener("onRewardedVideoAdClicked", (scene) => {
      this.log(`Rewarded video Ad clicked, scene: ${scene}`);
    });

    AdTiming.Events.addListener("onRewardedVideoAdClosed", (scene) => {
      this.log(`Rewarded video Ad closed, scene: ${scene}`);
    });
  },

  addInterstitialAdListeners() {
    AdTiming.Events.addListener(
      "onInterstitialAdAvailabilityChanged",
      (available) => {
        this.log(`Interstitial video Ad availability changed: ${available}`);
        if (available && !this.interstitialAdShowed) {
          AdTiming.showInterstitialAd();
          this.interstitialAdShowed = true;
        }
      }
    );

    AdTiming.Events.addListener("onInterstitialAdShowed", (scene) => {
      this.log(`Interstitial video Ad showed, scene: ${scene}`);
    });

    AdTiming.Events.addListener(
      "onInterstitialAdShowFailed",
      (scene, error) => {
        this.log(
          `Interstitial video Ad show failed, scene: ${scene}, error: ${error}`
        );
      }
    );

    AdTiming.Events.addListener("onInterstitialAdClicked", (scene) => {
      this.log(`Interstitial video Ad clicked, scene: ${scene}`);
    });

    AdTiming.Events.addListener("onInterstitialAdClosed", (scene) => {
      this.log(`Interstitial video Ad closed, scene: ${scene}`);
    });
  },

  getBannerAdPosition() {
    return this.bannerAdPosition === "Top"
      ? AdTiming.BannerAdPosition.Top
      : AdTiming.BannerAdPosition.Bottom;
  },

  getPlacementId() {
    return this.placementIdEditBox.string;
  },

  checkBannerAdLoaded() {
    const placementId = this.getPlacementId();
    if (!AdTiming.isBannerAdLoaded(placementId)) {
      this.log(
        `Banner Ad ${placementId} doesn't load, please load the banner Ad first`
      );
      return false;
    }
    return true;
  },
});
