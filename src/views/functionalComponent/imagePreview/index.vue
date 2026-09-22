<template>
  <div class="container">
    <div class="imagePreview">
      <div class="title">单图片预览</div>
      <a-image :width="200" src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
      <div class="title">多图片预览</div>
      <a-image-preview-group>
        <a-image :width="200" src="https://www.antdv.com/vue.png" />
        <a-image :width="200" src="https://www.antdv.com/logo.png" />
      </a-image-preview-group>
      <div class="title">容错处理</div>
      <a-image :width="200" :height="200" src="https://www.antdv.com/#error"
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==" />
    </div>
    <div class="APITip">
      <div class="title" style="text-align: center;">API配置项</div>
      <div class="form">
        <div class="label">alt(string)</div>
        <div class="value">图像描述</div>
        <div class="label">height(string | number)</div>
        <div class="value">图像高度</div>
        <div class="label">fallback(string)</div>
        <div class="value"> 加载失败容错地址</div>
        <div class="label">placeholder(boolean | slot)</div>
        <div class="value">加载占位, 为 true 时使用默认占位</div>
        <div class="label">preview(boolean | previewType)</div>
        <div class="value">预览参数，为 false 时禁用</div>
        <div class="label">src(string)</div>
        <div class="value">图片地址</div>
        <div class="label">previewMask(false | function | slot)</div>
        <div class="value">自定义 mask</div>
        <div class="label">width(string | number)</div>
        <div class="value">图像宽度</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 12px;
  display: flex;
  gap: 24px;

  .title {
    // text-align: left;
    font-size: 18px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .imagePreview {
    flex: 1;
    min-width: 0;
    :deep(.ant-image) {
      max-width: 100%;
    }
    :deep(.ant-image-img) {
      max-width: 100%;
      height: auto;
    }
  }

  .APITip {
    flex: 0 0 auto;   // 桌面端按内容宽度
    min-width: 0;     // 防止溢出
    max-width: 50%;   // 桌面端别把左边挤没
    .form {
      font-size: 14px;
      display: grid;
      grid-template-columns: minmax(140px, 260px) minmax(0, 1fr);
      gap: 0;

      .label {
        background-color: #fcf9f9;
        padding: 8px;
        border: 1px solid #e2e8f0;
        font-weight: 500;
        min-width: 0;
        overflow-wrap: anywhere; // 长 API 名（如 previewMask(...)）能换行
      }

      .value {
        padding: 8px;
        border: 1px solid #e2e8f0;
        min-width: 0;
        overflow-wrap: anywhere;
        word-break: break-word;
      }
    }
  }
}
/* ========== 移动端 ========== */
@media (max-width: 768px) {
  .container {
    box-sizing: border-box;
    flex-direction: column;
    height: 100dvh;
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    gap: 16px;
    padding: 12px;

    .imagePreview {
      flex: none;
      min-width: 0;
    }

    .APITip {
      flex: none;
      width: 100%;
      max-width: 100%;
      min-width: 0;

      .form {
        // 窄屏：标签和值上下堆叠，更易读
        grid-template-columns: minmax(0, 1fr);

        .label {
          font-weight: 600;
          color: #333;
          border-bottom: none; // 与下面的 value 合并成一个块
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .value {
          margin-bottom: 8px;
          background-color: #fff;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      }
    }
  }
}

/* 超窄屏进一步压缩字号 */
@media (max-width: 480px) {
  .container {
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    gap: 16px;
    padding: 12px;
    box-sizing: border-box;

    .title {
      font-size: 16px;
    }

    .APITip .form {
      font-size: 13px;
    }
  }
}
</style>