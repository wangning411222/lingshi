<template>
  <view class="content">
    <view class="comment-box">
      <view class="comment-shop">
        <u-avatar :src="logo"></u-avatar>
        <text>{{ name }}</text>
      </view>
      <view class="rate-box">
        <view class="rate-label">满意度</view>
        <view>
          <u-rate :count="rateCount" v-model="rateValue" :min-count="1" size="40" gutter="20"></u-rate>
        </view>
      </view>
      <view>
        <u-form :model="form" ref="uForm">
          <u-form-item>
            <u-input v-model="form.comment" placeholder="满意你就夸一夸,点击这里快捷输入评价" type="textarea " />
            <u-upload max-count="3" :deletable="false" :auto-upload="false" @on-choose-complete="autoUpload"></u-upload>
          </u-form-item>
        </u-form>
        <view class="form-submit">
          <u-button @click="submit" :disabled="buttonDisable">提交</u-button>
        </view>
        <u-toast ref="uToast" />
      </view>
    </view>
  </view>
</template>

<script>
import { domain } from "../../tools/utils.js";
export default {
  data() {
    return {
      rateCount: 5,
      rateValue: null,
      form: {
        comment: "",
      },
      url: "",
      imgurlList: [],
      logo: "",
      orderid: "",
      companyid: null,
      name: ''
    };
  },
  onShow() { },
  onLoad(option) {
    let obj = JSON.parse(decodeURIComponent(option.data));
    this.logo = obj.logo;
    this.name = obj.name
    this.orderid = obj.order_token;
    this.companyid = obj.companyid;
  },
  computed: {
    buttonDisable() {
      return this.rateValue && this.form.comment ? false : true;
    },
  },
  methods: {
    autoUpload(lists, name) {
      this.imgurlList = []
      let userInfo = uni.getStorageSync("userInfo");
      let promiseArr = lists.map((item, index) => {
        return new Promise((resolve, reject) => {
          uni.uploadFile({
            url: domain() + "/user-upimg.htm?token=" + userInfo.token, //仅为示例，非真实的接口地址
            filePath: item.file.path,
            name: "file",
            success: (uploadFileRes) => {
              let obj = JSON.parse(uploadFileRes.data);
              if (obj.code == 0) {
                resolve(obj.message.url)
              }
            },
            fail: (err) => {
              reject(err)
            },
          });
        })
      })
      Promise.all(promiseArr).then((res) => {
        this.imgurlList = res
      })

    },
    submit() {
      let data = {
        img_str: this.imgurlList.join(),
        star_nums: this.rateValue,
        message: this.form.comment,
        order_token: this.orderid,
      };
      this.$store.dispatch("shops/postCreate", data).then((res) => {
        if (res.code == 0) {
          this.$refs.uToast.show({
            title: "评价完成",
            type: "success",
          });
          setTimeout(() => {
            uni.navigateTo({
              url: `/pages/store/index?companyid=${this.companyid}&type=comment`,
            });
          }, 1000);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.content {
  background: whitesmoke;
  width: 100%;
  height: 100vh;

  .comment-box {
    margin: 20rpx;
    border-radius: 5px;
    background: #fff;
    width: calc(100% - 40rpx);
    height: 100%;
    padding: 20rpx;

    .comment-shop {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-left: 30rpx;

      text {
        font-weight: bold;
        margin: 0 20rpx;
      }
    }

    .rate-box {
      margin-top: 40rpx;
      display: flex;
      flex-direction: row;
      margin-left: 30rpx;

      .rate-label {
        color: #fa3534;
      }
    }

    .u-form {
      margin-left: 30rpx;

      .u-input {
        min-height: 300rpx;
      }
    }

    .form-submit {
      margin-top: 40rpx;
    }
  }
}
</style>
