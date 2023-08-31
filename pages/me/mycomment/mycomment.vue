<template>
	<view>
		<u-navbar :is-back="true" title="　" :border-bottom="false" :background="{
			background: 'linear-gradient(to right, #80D0C7, #0093E9)',
		}"></u-navbar>
		<view v-if="isAuthorized" class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30 ">
			<view class="u-m-r-10">
				<u-avatar :src="userInfo.avatar_url_fmt" size="140" :show-level="true"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20 submit-btn">{{ userInfo.nick_name || "用户" +
					userInfo.uid }}</view>
			</view>
		</view>
		<view class="comment-list" v-if='dataList.length'>
			<view class="comment-item" v-for="(item, index) in dataList" :key="index">
				<view class="comment-item-top">
					<view class="item-top-left">
						<img :src="item.company_logo" alt="">
						<text>{{ item.company_name }}</text>
					</view>
					<view class="item-top-right">
						{{ item.create_date_fmt }}
					</view>
				</view>
				<view class="comment-content">
					<view class="content-rate">
						<text>满意度</text>
						<uni-rate size="20" :value="item.star_nums"></uni-rate>
					</view>
					<view>{{ item.message }}</view>
					<view class="content-img">
						<view class="img-item" v-for="(itemimg, indeximg) in item.img_arr" :key="indeximg">
							<img :src="itemimg" alt="">
						</view>

					</view>
					<view v-if="item.replay != ''" class="replay-content">
						<view>商家回复</view>
						<view>{{ item.replay }}</view>
					</view>
				</view>
				<view class="comment-bottom" @tap="deleteComment(item)">
					<u-icon name="trash" size="28"></u-icon>
					<text>删除</text>
				</view>
			</view>
		</view>
		<view class="no-lists" v-else>暂无评论</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
import {
	mapMutations,
	mapGetters
} from "vuex";
export default {
	data() {
		return {
			dataList: []
		}
	},
	onShow() {
		this.getList()
	},
	onLoad() { },
	methods: {
		getList() {
			this.$store
				.dispatch("user/postMylist")
				.then((res) => {
					if (res.code == 0) {
						this.dataList = res.message.post_list
					}
				});
		},
		deleteComment(item) {
			let data = {
				pid: item.pid
			}
			this.$store
				.dispatch("user/postDelete", data)
				.then((res) => {
					if (res.code == 0) {
						this.$refs.uToast.show({
							title: '删除成功',
							type: 'success'
						})
						this.getList()
					}
				});

		},
	},
	computed: {
		...mapGetters("user", ["isAuthorized", "userInfo"]),
		...mapGetters("config", ["config"]),
	},
}
</script>

<style lang='scss'>
page {
	background: whitesmoke;
}

.no-lists {
	padding: 40rpx 0;
	text-align: center;
	font-size: 40rpx;
	color: #666;
}

.user-box {
	color: #ffffff;
	background: linear-gradient(to right, #80d0c7, #0093e9);
}

.comment-list {
	display: flex;
	flex-direction: column;
	padding: 30rpx;

	.comment-item {
		background: #fff;
		border-radius: 4px;
		padding: 30rpx;
		margin-bottom: 30rpx;

		.comment-item-top {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			.item-top-left {
				display: flex;
				flex-direction: row;

				img {
					width: 40rpx;
					height: 40rpx;
					border-radius: 4rpx;
				}

				text {
					color: #000;
					margin-left: 20rpx;
				}
			}
		}

		.comment-content {
			margin: 20rpx 0;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #c9c9c9b3;

			.content-rate {
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
				margin-bottom: 30rpx;

				text {
					margin-right: 30rpx;
					color: #ccc;
				}

			}

			.content-img {
				display: flex;
				flex-direction: row;

				.img-item {
					width: 60rpx;
					height: 60rpx;
					margin: 10px;
					border-radius: 2px;

					img {
						width: 100%;
						height: 100%;
					}
				}


			}

			.replay-content {
				margin-top: 20rpx;
				background: whitesmoke;
				border-radius: 4px;
				padding: 10rpx;

				&>view:first-child {
					font-weight: bold;
					font-size: 30rpx;
					margin-bottom: 8rpx;
					color: #000;
				}

				&>view:last-child {
					font-size: 26rpx;
					color: #666;
					line-height: 30rpx;
				}
			}

		}

		.comment-bottom {
			display: flex;
			flex-direction: row;
			justify-content: flex-end;
			align-items: center;
		}

	}
}
</style>