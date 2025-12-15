import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {
  User,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '@/constants/theme';

interface MenuItem {
  icon: any;
  label: string;
  action: () => void;
  showChevron?: boolean;
  color?: string;
}

export default function ProfileScreen() {
  const menuSections: { title?: string; items: MenuItem[] }[] = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Personal Information',
          action: () => console.log('Personal Info'),
          showChevron: true,
        },
        {
          icon: MapPin,
          label: 'Delivery Addresses',
          action: () => console.log('Addresses'),
          showChevron: true,
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          action: () => console.log('Payment'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          action: () => console.log('Notifications'),
          showChevron: true,
        },
        {
          icon: Settings,
          label: 'Settings',
          action: () => console.log('Settings'),
          showChevron: true,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          action: () => console.log('Help'),
          showChevron: true,
        },
      ],
    },
    {
      items: [
        {
          icon: LogOut,
          label: 'Logout',
          action: () => console.log('Logout'),
          showChevron: false,
          color: COLORS.livingCoral,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, index: number) => {
    const IconComponent = item.icon;
    const iconColor = item.color || COLORS.charcoalSlate;

    return (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={item.action}>
        <View style={styles.menuItemLeft}>
          <View
            style={[
              styles.iconContainer,
              item.color && { backgroundColor: `${item.color}15` },
            ]}>
            <IconComponent size={20} color={iconColor} />
          </View>
          <Text
            style={[styles.menuItemText, item.color && { color: item.color }]}>
            {item.label}
          </Text>
        </View>
        {item.showChevron && (
          <ChevronRight size={20} color={COLORS.gray} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <User size={32} color={COLORS.white} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>john.doe@example.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>$1,248</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.content}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}
              <View style={styles.menuCard}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    {renderMenuItem(item, itemIndex)}
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.riceWhite,
    marginHorizontal: SPACING.md,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.livingCoral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  profileName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.charcoalSlate,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  editButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.livingCoral,
  },
  editButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.livingCoral,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.riceWhite,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.charcoalSlate,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  content: {
    paddingHorizontal: SPACING.md,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.gray,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: COLORS.riceWhite,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  menuItemText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.charcoalSlate,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.white,
    marginLeft: 68,
  },
  footer: {
    paddingVertical: SPACING.xl,
    alignItems: 'center',
  },
  version: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
});
