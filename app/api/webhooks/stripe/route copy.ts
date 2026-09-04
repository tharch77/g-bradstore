export const dynamic = 'force-dynamic'; // 💡これを先頭に置くだけでNext.jsのビルドテストを安全にスキップできます

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/lib/actions/order.actions';

// 💡 ビルド時（Vercelのデータ収集時）にキーが無くても絶対にクラッシュしないように防御壁を作ります
const stripeKey = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2025-02-24.acacia' }) // キーがあれば初期化
  : null; // 💡 キーがなければ空っぽ(null)にして、ビルド時のクラッシュを100%防ぐ

export async function POST(req: NextRequest) {
  // もし初期化に失敗している（ビルド時のテストなど）場合は、即座にエラーではなく安全にリターンさせる
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not initialized' },
      { status: 500 }
    );
  }

  // ...これ以降の既存のPOST関数の中身（req.text() やイベント処理など）は一切書き換えずにそのまま残してください...
  // Build the webhook event
  const event = await Stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get('stripe-signature') as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // Check for successful payment
  if (event.type === 'charge.succeeded') {
    const { object } = event.data;

    // Update order status
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: 'COMPLETED',
        email_address: object.billing_details.email!,
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
}
