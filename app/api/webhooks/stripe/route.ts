export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { updateOrderToPaid } from '@/lib/actions/order.actions';

// 💡 1. どんな状況（ビルド時含む）でも、絶対にエラーを吐かない最強の初期化関数を作ります
const getStripeInstance = () => {
  try {
    const apiKey =
      process.env.STRIPE_SECRET_KEY ||
      'sk_test_dummy_key_to_prevent_vercel_build_error_12345';
    return new Stripe(apiKey, {
      apiVersion: '2025-02-24.acacia',
    });
  } catch (e) {
    return null;
  }
};

// 💡 2. 他のファイルが「import { stripe }」で読み込んでいた場合のクラッシュを防ぐ防御壁
const globalInstance = getStripeInstance();
export { globalInstance as stripe };

export async function POST(req: Request) {
  // 💡 3. Vercelのビルド中（データ収集フェーズ）は、即座に「成功(200)」を返して、下のStripe処理を1ミリも実行させずに終了します
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json(
      { message: 'Bypassed during build' },
      { status: 200 }
    );
  }

  // 実際の本番稼働時にインスタンスを安全に取得
  const stripeInstance = getStripeInstance();
  if (!stripeInstance) {
    return NextResponse.json(
      { error: 'Stripe initialization failed' },
      { status: 500 }
    );
  }

  try {
    const event = stripeInstance.webhooks.constructEvent(
      await req.text(),
      req.headers.get('stripe-signature') as string,
      (process.env.STRIPE_WEBHOOK_SECRET || '') as string
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
