- [介绍](#介绍)
  - [AdTiming](#adtiming)
  - [Cocos Service AdTiming 插件](#cocos-service-adtiming-插件)
- [使用入门](#使用入门)
  - [集成广告网络](#集成广告网络)
    - [AdMob](#admob)
  - [iOS 14](#ios-14)
  - [JavaScript API 使用入门](#javascript-api-使用入门)
    - [调试信息](#调试信息)
    - [初始化](#初始化)
    - [横幅广告](#横幅广告)
    - [激励视频](#激励视频)
    - [插屏广告](#插屏广告)

# 介绍

## AdTiming

[**AdTiming**](https://www.adtiming.com/)：全球营销平台，致力于帮助移动应用开发者获取更高广告收益、提高广告效率，打造从用户获取到应用变现的流量闭环。

## Cocos Service AdTiming 插件

Cocos Service AdTiming 插件帮助您快速集成 AdTiming SDK ，并提供 JavaScript SDK 供您使用。您只需要在服务面板开启 AdTiming 服务，填写相关参数，然后在游戏源码中调用插件提供的 JavaScript SDK 即可。在构建到 Android/iOS 平台时，插件会自动帮您将 AdTiming SDK 集成到项目中。

# 使用入门

首先，您需要在服务面板启用 AdTiming 服务，然后点击进入 AdTiming 插件面板。

启用 AdTiming 服务后，插件会立刻集成 AdTiming JavaScript SDK 到您的项目中，不过在您调用 JavaScript API 前，还需要您在插件面板中填写 AdTiming 的 app key （ app key 请到 AdTiming 后台获取）。
AdTiming app key 分 Android 平台使用的 app key 以及 iOS 平台使用的 app key ，若您只需要构建到其中一个平台，那么可以选择仅填写一个 app key 。填写后，点击下方的保存按钮进行保存。

除了填写 AdTiming app key 外，您还可以自行勾选多个要聚合的广告网络，然后点击保存。您也可以不勾选广告网络，先用 AdTiming 自带的广告网络进行测试。

## 集成广告网络

在插件面板，您可以勾选多个要集成的广告网络，其中，某些广告网络需要填写额外的参数，各个广告网络的具体情况请参考下面的说明。

### AdMob

在要集成的广告网络中勾选 AdMob 后，插件面板下方会出现编辑框让您填写 AdMob 的 app ID ，这是必填项，请在填写后点击保存按钮进行保存。如果不填写或者填写了非法的 app ID ，那么您的游戏在在启动后会立刻崩溃。

## iOS 14

iOS 14 改变了 IDFA 的获取方式，以及推出了新的 SKAdNetwork 框架。如果您需要支持 iOS 14，请在插件面板中勾选启用 iOS 14 集成。

启用后，会弹出编辑框让您填写广告追踪的权限说明，该权限说明用于告知用户为什么该应用要请求数据的使用权限以来追踪用户或者设备。作为一个例子，您可以填写：您的数据将被用来提供给您一个更好的、个性化的广告体验。

构建后，插件会自动帮您插入广告追踪的权限说明以及 AdTiming 聚合的多个广告网络的SKAdNetworkIdentifier，且游戏启动后，会自动弹出对话框向用户申请获取 IDFA 的权限。

您可以自行加入更多广告网络的SKAdNetworkIdentifier。

## JavaScript API 使用入门

插件在项目内添加了 JavaScript SDK 的 DTS 文件 （*.d.ts 文件），里面有各 API 的声明以及文档，您可以自行查看，下面仅是 API 的简单使用介绍。

### 调试信息

``AdTiming.setLogEnable`` 可以用于启用调试信息的打印，便于调试。

示例：

```JavaScript
AdTiming.setLogEnable(true);
```

### 初始化

在使用其他 API 前，您需要调用 ``AdTiming.init`` 来初始化 AdTiming SDK 。

初始化成功，会产生 ``sdkInitSuccess`` 事件，初始化失败，会产生 ``sdkInitFailed`` 事件，在调用 ``AdTiming.init`` 之前，您需要先添加这两个事件的事件监听器。

示例：

```JavaScript
AdTiming.Events.addListener("sdkInitSuccess", () => {
  cc.log("初始化 SDK 成功");
});

AdTiming.Events.addListener("sdkInitFailed", (error) => {
  cc.log(`初始化 SDK 失败 - ${error}`);
});

// 没有传 app key 或者 app key 为undefined、空字符串 '' ，
// SDK 均会使用您在服务面板填写的 app key 。
AdTiming.init();

// 您也可以显式传入特定的 AdTiming app key ，
// 此时 SDK 会忽略您在服务面板输入的 app key 。
// AdTiming.init('您的 AdTiming app key');

// 您可以指定要预加载的广告类型，下面代码指定要预加载插屏广告和激励广告。
// AdTiming.init('', AdTiming.AdTypes.Interstitial | AdTiming.AdTypes.RewardedVideo);
// 如果不指定要加载的广告类型，则默认全部预加载（仅AdTiming.AdTypes中的广告类型，不包括横幅广告）。
```

### 横幅广告

首先需要加载横幅广告，通过 ``AdTiming.loadBannerAd`` 来进行。

示例：

```JavaScript
// 第一个参数是横幅广告的placement ID ，请在 AdTiming 后台获取。
// 第二个参数是横幅广告的大小。
// 第三个参数是横幅广告的位置，可以是顶部或者底部。
AdTiming.loadBannerAd('1234', AdTiming.AdSize.Smart, AdTiming.BannerAdPosition.Top);
```

横幅广告会产生一系列事件，您可以加入监听器来监听这些事件。

示例：

```JavaScript
AdTiming.Events.addListener("onBannerAdReady", (placementId) => {
  cc.log(`横幅广告 ${placementId} 有库存了`);
});

AdTiming.Events.addListener("onBannerAdFailed", (placementId, msg) => {
  cc.log(`加载横幅广告 ${placementId} 失败：${msg}`);
});

AdTiming.Events.addListener("onBannerAdClicked", (placementId) => {
  cc.log(`横幅广告 ${placementId} 被点击了`);
});
```

横幅广告加载完成后，默认会立马显示，您可以控制横幅广告的显示、隐藏。显示横幅广告使用 ``AdTiming.showBannerAd`` ，隐藏横幅广告使用 ``AdTiming.hideBannerAd`` ，获取横幅广告可见性使用 ``AdTiming.isBannerAdVisible`` 。

示例：

```JavaScript
// 显示横幅广告。
AdTiming.showBannerAd('1234');

// 隐藏横幅广告。
AdTiming.hideBannerAd('1234');

// 获取横幅广告可见性。
if (AdTiming.isBannerAdVisible()) {
  ...
} else {
  ...
}
```

您可以获取、改变横幅广告的位置，获取位置使用 ``AdTiming.getBannerAdPosition`` ，改变位置使用 ``AdTiming.changeBannerAdPosition`` 。

示例：

```JavaScript
// 获取横幅广告位置。
// 返回 AdTiming.BannerAdPosition.Top 或者 AdTiming.BannerAdPosition.Bottom 。
AdTiming.getBannerAdPosition('1234');

// 改变横幅广告位置。
AdTiming.changeBannerAdPosition('1234', AdTiming.BannerAdPosition.Bottom);
```

您可以使用 ``AdTiming.isBannerAdLoaded`` 来判断一个 placement ID 对应的横幅广告是否已经加载过了，避免重复加载。（注：该方法只能用于判断是否对一个 placement ID 调用过 AdTiming.loadBannerAd，并不能用于判断加载是成功还是失败）。

示例：

```JavaScript
const placementId = '1234';
if (!AdTiming.isBannerAdLoaded(placementId)) {
  AdTiming.loadBannerAd(placementId);
}
```

您可以使用 ``AdTiming.destroyBannerAd`` 来销毁指定横幅广告，或者使用 ``AdTiming.destroyAllBannerAds`` 来销毁所有横幅广告。

示例：

```JavaScript
// 销毁指定横幅广告。
AdTiming.destroyBannerAd('1234');

// 销毁所有横幅广告。
AdTiming.destroyAllBannerAds();
```

### 激励视频

激励视频会产生一系列事件，您可以添加对应的事件监听器。

示例：

```JavaScript
AdTiming.Events.addListener(
  "onRewardedVideoAvailabilityChanged",
  (available) => {
    cc.log(`激励视频库存改变了：${available}`);
  }
);

AdTiming.Events.addListener("onRewardedVideoAdShowed", (scene) => {
  cc.log(`激励视频显示了,场景：${scene}`);
});

AdTiming.Events.addListener(
  "onRewardedVideoAdShowFailed",
  (scene, error) => {
    cc.log(
      `激励视频显示失败了，场景：${scene}，错误：${error}`
    );
  }
);

AdTiming.Events.addListener("onRewardedVideoAdClicked", (scene) => {
  cc.log(`激励视频被点击了，场景：${scene}`);
});

AdTiming.Events.addListener("onRewardedVideoAdClosed", (scene) => {
  cc.log(`激励视频关闭了，场景：${scene}`);
});
```

您可以使用 ``AdTiming.isRewardedVideoReady`` 来判断激励视频是否有库存，使用 ``AdTiming.showRewardedVideo`` 来显示激励视频。

示例：

```JavaScript
if (AdTiming.isRewardedVideoReady()) {
  // 显示激励视频，场景为默认场景。
  AdTiming.showRewardedVideo();

  // 您可以指定要显示的场景。
  // AdTiming.showRewardedVideo('场景名称');

  // 当找不到指定的场景时，会显示默认场景，特别的，您可以指定空字符串来显示默认场景。
  // AdTiming.showRewardedVideo('不存在的场景名');
  // AdTiming.showRewardedVideo('');
}
```

``AdTiming.showRewardedVideo`` 的第二个参数可以指定extId，其具体含义见：[激励视频](https://support.adtiming.com/hc/zh-cn/articles/360044290194-%E6%BF%80%E5%8A%B1%E8%A7%86%E9%A2%91)。

示例：

```JavaScript
// 显示默认场景，并设置extID
AdTiming.showRewardedVideo('', '您的extID');
```

### 插屏广告

激励视频会产生一系列事件，您可以添加对应的事件监听器。

示例：

```JavaScript
AdTiming.Events.addListener(
  "onInterstitialAdAvailabilityChanged",
  (available) => {
    cc.log(`插屏广告库存改变了：${available}`);
  }
);

AdTiming.Events.addListener("onInterstitialAdShowed", (scene) => {
  cc.log(`插屏广告显示了，场景：${scene}`);
});

AdTiming.Events.addListener(
  "onInterstitialAdShowFailed",
  (scene, error) => {
    cc.log(
      `插屏广告显示失败了，场景：${scene}，错误：${error}`
    );
  }
);

AdTiming.Events.addListener("onInterstitialAdClicked", (scene) => {
  cc.log(`插屏广告被点击了，场景：${scene}`);
});

AdTiming.Events.addListener("onInterstitialAdClosed", (scene) => {
  cc.log(`插屏广告关闭了，场景：${scene}`);
});
```

您可以使用 ``AdTiming.isInterstitialAdReady`` 来判断插屏视频是否有库存，使用 ``AdTiming.showInterstitialAd`` 来显示插屏视频。

示例：

```JavaScript
if (AdTiming.isInterstitialAdReady()) {
  // 显示激励视频，场景为默认场景。
  AdTiming.showInterstitialAd();

  // 您可以指定要显示的场景。
  // AdTiming.showInterstitialAd('场景名称');

  // 当找不到指定的场景时，会显示默认场景，特别的，您可以指定空字符串来显示默认场景。
  // AdTiming.showInterstitialAd('不存在的场景名');
  // AdTiming.showInterstitialAd('');
}
```
