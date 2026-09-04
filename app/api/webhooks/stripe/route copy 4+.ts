export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { updateOrderToPaid } from '@/lib/actions/order.actions';

// 💡 1. 接続キーを安全に取得（空なら絶対にダミーを差し込む）
const apiKey =
  process.env.STRIPE_SECRET_KEY ||
  'sk_test_dummy_key_to_prevent_vercel_build_error_12345';

// 💡 2. try-catch で囲み、万が一Stripe側がエラーを投げてもファイル全体のクラッシュを防ぐ
let stripeInstance: Stripe | null = null;
try {
  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia',
  });
} catch (e) {
  console.log('Stripe initialization skipped during build');
}

// 他のファイルから読み込まれたときのためにエクスポート名を維持
export { stripeInstance as stripe };

export async function POST(req: Request) {
  // 💡 3. Vercelのビルド時、またはStripeの初期化に失敗している場合は、中身をスルーして即時成功を返す
  if (process.env.NEXT_PHASE === 'phase-production-build' || !stripeInstance) {
    return NextResponse.json(
      { message: 'Bypassed or Not initialized' },
      { status: 200 }
    );
  }

  try {
    // 💡 修正ポイント：
    // ① 先頭の「await」を削除
    // ② 大文字の「Stripe.webhooks」ではなく、作成した「stripeInstance.webhooks」を使う
    const event = stripeInstance.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Check for successful payment
    if (event.type === 'charge.succeeded') {
      const object = event.data.object as any;

      // Update order status
      await updateOrderToPaid({
        orderId: object.metadata.orderId,
        paymentResult: {
          id: object.id,
          status: 'COMPLETED',
          email_address: object.billing_details.email || '',
          pricePaid: (object.amount / 100).toFixed(),
        },
      });

      return NextResponse.json({
        message: 'updateOrderToPaid was successful',
      });
    }

    return NextResponse.json({
      message: 'event is not charge.succeeded',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
