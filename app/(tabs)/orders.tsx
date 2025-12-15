import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  items: number;
  total: number;
  date: string;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: COLORS.gray,
    icon: Clock,
  },
  preparing: {
    label: 'Preparing',
    color: COLORS.wasabiGreen,
    icon: Package,
  },
  delivering: {
    label: 'On the Way',
    color: COLORS.livingCoral,
    icon: Package,
  },
  completed: {
    label: 'Completed',
    color: COLORS.wasabiGreen,
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: COLORS.gray,
    icon: XCircle,
  },
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: '#ORD-2024-001',
      status: 'delivering',
      items: 3,
      total: 82.97,
      date: '2024-12-15',
    },
    {
      id: '2',
      orderNumber: '#ORD-2024-002',
      status: 'preparing',
      items: 2,
      total: 53.98,
      date: '2024-12-15',
    },
    {
      id: '3',
      orderNumber: '#ORD-2024-003',
      status: 'completed',
      items: 4,
      total: 125.96,
      date: '2024-12-14',
    },
    {
      id: '4',
      orderNumber: '#ORD-2024-004',
      status: 'completed',
      items: 1,
      total: 24.99,
      date: '2024-12-13',
    },
  ]);

  const activeOrders = orders.filter(
    (order) =>
      order.status === 'pending' ||
      order.status === 'preparing' ||
      order.status === 'delivering'
  );

  const historyOrders = orders.filter(
    (order) => order.status === 'completed' || order.status === 'cancelled'
  );

  const displayOrders = activeTab === 'active' ? activeOrders : historyOrders;

  const renderOrder = (order: Order) => {
    const statusConfig = STATUS_CONFIG[order.status];
    const StatusIcon = statusConfig.icon;

    return (
      <TouchableOpacity key={order.id} style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderDate}>{order.date}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: `${statusConfig.color}20` },
            ]}>
            <StatusIcon size={14} color={statusConfig.color} />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Items</Text>
            <Text style={styles.orderDetailValue}>{order.items}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Total</Text>
            <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {order.status === 'delivering' && (
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Track Order</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'active' && styles.tabTextActive,
            ]}>
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.tabTextActive,
            ]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {displayOrders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Package size={60} color={COLORS.lightGray} />
            <Text style={styles.emptyTitle}>
              {activeTab === 'active'
                ? 'No active orders'
                : 'No order history'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'active'
                ? 'Your active orders will appear here'
                : 'Your past orders will appear here'}
            </Text>
          </View>
        ) : (
          displayOrders.map(renderOrder)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.charcoalSlate,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.riceWhite,
    borderRadius: BORDER_RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.livingCoral,
  },
  tabText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SPACING.xl * 2,
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.charcoalSlate,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: COLORS.riceWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.charcoalSlate,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.sm,
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  orderDetails: {
    marginBottom: SPACING.sm,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  orderDetailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray,
  },
  orderDetailValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.charcoalSlate,
  },
  orderTotal: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.livingCoral,
  },
  trackButton: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.livingCoral,
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  trackButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.livingCoral,
  },
});
