<script setup lang="ts">
import SideBar from '@/components/SideBar.vue'
import headerImg from '@/assets/img/apotek-sidebar-header.webp'
import { Clock, Phone } from '@lucide/vue';

type Props = {
  side: 'left' | 'right',
  width: string,
}

const props = withDefaults(defineProps<Props>(), {
  side: 'left'
})
</script>

<template>
  <SideBar :side="props.side" :width="props.width" class="desktop-sidebar" :src="headerImg">
    <div class="place-card">
      <div class="content-wrap">
        <h1>
          Apotek ExtraMedic &amp;<br />
          Praktek Psikiater dr. Prianto<br />
          Djatmiko, SpKJ
        </h1>

        <div class="rating-row">
          <span class="rating-score">5.0</span>
          <span class="stars">★★★★★</span>
          <span class="count">(26)</span>
        </div>

        <div class="category">Pharmacy</div>

        <div class="services">
          <div class="service-row">
            <span class="check">✓</span>
            <span>In-store shopping</span>
          </div>
          <div class="service-row">
            <span class="check">✓</span>
            <span>In-store pick-up</span>
          </div>
          <div class="service-row">
            <span class="check">✓</span>
            <span>Delivery</span>
          </div>
        </div>

        <div class="address">
          <div class="pin-wrap">
            <span class="pin">◉</span>
          </div>
          <p>
            Ruko Sentra Niaga Blok E No. 025,<br />
            RT.6/RW.8, Duri Kosambi,<br />
            Kecamatan Cengkareng, Kota<br />
            Jakarta Barat, Daerah Khusus<br />
            Ibukota Jakarta 11750
          </p>
        </div>

        <div class="info-list">
          <div class="info-item pt-0">
            <div class="info-icon clock"> <Clock /></div>
            <div class="hours-list">
              <div class="hours-row"><span>Sunday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Monday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Tuesday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Wednesday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Thursday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Friday</span><span>8:00 am–8:00 pm</span></div>
              <div class="hours-row"><span>Saturday</span><span>8:00 am–8:00 pm</span></div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon phone"><Phone /></div>
            <div class="info-copy">
              <div class="info-main">0811-365-911</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-icon badge">❤</div>
            <div class="info-copy">
              <div class="info-main">Identifies as women-owned</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SideBar>
</template>

<style>
.desktop-sidebar {
  .place-card {
    background: #f5f5f5;
  }

  .hero-image {
    position: relative;
    height: 210px;
    background:
      linear-gradient(rgba(26, 46, 68, 0.18), rgba(26, 46, 68, 0.18)),
      url('https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80') center/cover no-repeat;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }

  .hero-badge {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 180px;
    padding: 14px 18px;
    border-radius: 10px;
    background: rgba(11, 71, 136, 0.82);
    color: #fff;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-align: center;
    line-height: 1.2;
    font-size: 0.95rem;
    box-shadow: 0 10px 25px rgba(5, 32, 56, 0.25);
  }

  .content-wrap {
    padding: 22px 18px 28px;
  }

  h1 {
    margin: 0;
    font-size: 1.375rem;
    letter-spacing: 0rem;
    line-height: 1.75rem;
    color: #171819;
    font-weight: 400;
  }

  img {
    max-width: 100%;
  }

  .rating-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 22px;
    font-size: 1.1rem;
    color: #1f1f1f;
  }

  .rating-score {
    font-weight: 700;
  }

  .stars {
    color: #ffb400;
    letter-spacing: 0.1em;
    font-size: 0.875rem;
  }

  .count {
    color: #5e6369;
  }

  .category {
    margin-top: 10px;
    font-size: 1.1rem;
    color: #4e4f52;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-top: 28px;
    border-bottom: 1px solid #d7d7d7;
    padding-bottom: 2px;
  }

  .tab {
    background: transparent;
    border: none;
    padding: 0 4px 14px;
    font-size: 1.1rem;
    color: #555;
    font-weight: 500;
    cursor: pointer;
    position: relative;

    &.active {
      color: #1c1c1c;
      font-weight: 700;

      &::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -2px;
        height: 3px;
        background: #2ab3d7;
        border-radius: 3px 3px 0 0;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    margin-top: 26px;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    color: #2b2b2b;
    font-size: 0.95rem;
  }

  .action-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: #0c7a8a;
    background: #dff5fb;
    box-shadow: inset 0 0 0 2px rgba(12, 122, 138, 0.16);

    &.direction { font-size: 1.2rem; }
    &.save { font-size: 1.1rem; }
    &.nearby { font-size: 1.3rem; }
    &.phone { font-size: 1.5rem; }
    &.share { font-size: 1.3rem; }
  }

  .services {
    margin-top: 26px;
    padding-top: 18px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
  }

  .service-row {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.875rem;
    color: #1a1a1a;
  }

  .check {
    color: #2aa56b;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .dot {
    margin-left: 4px;
    color: #3d3d3d;
  }

  .address {
    margin-top: 28px;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    color: #1d2125;
    font-size: 1.1rem;
    line-height: 1.4;
  }

  .pin-wrap {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4px;
  }

  .pin {
    color: #1f7d94;
    font-size: 1.7rem;
  }

  .address p {
    margin: 0;
    font-size: 0.875rem;
  }

  .info-list {
    margin-top: 24px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    padding-top: 12px;
  }

  .info-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  .info-item .info-copy {
    flex: 1;
  }

  .info-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0f8ea9;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .info-copy {
    min-width: 0;
  }

  .hours-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 10px;
  }

  .hours-row {
    display: flex;
    gap: 12px;
    font-size: 0.875rem;
    line-height: 1.4;
    color: #3e4348;
  }

  .hours-row span:first-child {
    min-width: 74px;
    color: #2d2f31;
  }

  .hours-row span:last-child {
    text-align: right;
  }

  .info-main {
    font-size: .875rem;
    font-weight: 600;
    color: #1f1f1f;
  }

  .info-main.open {
    color: #1d1d1d;
  }

  .info-sub {
    font-size: 0.9rem;
    color: #5a5a5a;
    margin-top: 4px;
  }

  .info-link {
    font-size: 0.9rem;
    color: #0a7f9e;
    margin-top: 4px;
  }

  .arrow {
    font-size: 2rem;
    line-height: 1;
    color: #3a3a3a;
  }

  .suggest-button,
  .add-photo-button,
  .website-button {
    width: 100%;
    border: none;
    border-radius: 999px;
    background: #dfeff4;
    color: #0d6c83;
    font-weight: 700;
    font-size: 1.15rem;
    padding: 16px 18px;
    margin-top: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .suggest-button {
    margin-top: 20px;
    background: #dfeef5;
  }

  .pencil,
  .globe,
  .help {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 26px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  .section-header h2 {
    margin: 0;
    font-size: .875rem;
    font-weight: 700;
    color: #1d2022;
  }

  .help {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: #6f7378;
    font-weight: 700;
    font-size: 0.9rem;
  }

  .website-button {
    background: #e9ecee;
    justify-content: flex-start;
    padding-left: 20px;
    margin-top: 18px;
  }

  .gallery {
    display: flex;
    gap: 12px;
    margin-top: 18px;
  }

  .photo-card {
    flex: 1;
  }

  .photo-card {
    position: relative;
    height: 180px;
    border-radius: 18px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    padding: 12px;
    color: #fff;
    font-weight: 700;
    background-size: cover;
    background-position: center;
    box-shadow: inset 0 -40px 40px rgba(0, 0, 0, 0.22);
  }

  .photo-one {
    background-image: linear-gradient(rgba(26, 46, 68, 0.18), rgba(26, 46, 68, 0.18)), url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80');
  }

  .photo-two {
    background-image: linear-gradient(rgba(26, 46, 68, 0.12), rgba(26, 46, 68, 0.12)), url('https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80');
  }

  .photo-three {
    background-image: linear-gradient(rgba(26, 46, 68, 0.12), rgba(26, 46, 68, 0.12)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80');
  }

  .photo-card span {
    font-size: 1.1rem;
    line-height: 1.2;
  }

  .summary-header {
    margin-top: 30px;
  }

  .summary-row {
    display: flex;
    gap: 18px;
    align-items: flex-end;
    margin-top: 16px;
  }

  .bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .bar-row {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 0.9rem;
    color: #4f5256;
  }

  .bar-row > span {
    width: 16px;
    flex-shrink: 0;
  }

  .bar-row .bar {
    flex: 1;
  }

  .bar {
    height: 8px;
    border-radius: 999px;
    background: #e7e8ea;
  }

  .bar.fill {
    background: #f3c64a;
  }

  .summary-score-wrap {
    text-align: center;
    min-width: 130px;
  }

  .summary-score {
    font-size: 4.2rem;
    line-height: 1;
    font-weight: 700;
    letter-spacing: -0.08em;
    color: #1b1d1f;
  }

  .summary-stars {
    margin-top: 6px;
    color: #ffb400;
    letter-spacing: 0.12em;
    font-size: 1.1rem;
  }

  .summary-count {
    margin-top: 10px;
    font-size: 0.95rem;
    color: #62676d;
  }

  @media (max-width: 430px) {
    .content-wrap {
      padding-left: 14px;
      padding-right: 14px;
    }

    .actions {
      flex-wrap: wrap;
    }

    .tab {
      font-size: 1rem;
    }

    .gallery {
      flex-direction: column;
    }

    .summary-row {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>
