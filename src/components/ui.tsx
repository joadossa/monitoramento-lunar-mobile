import { type ReactNode } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export function SidebarItem({
  label,
  icon,
  active,
  danger = false,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.sidebarItem,
        active && styles.sidebarItemActive,
        danger && active && styles.sidebarItemDanger,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.sidebarIcon, active && styles.sidebarTextActive]}>
        {icon}
      </Text>

      <Text style={[styles.sidebarText, active && styles.sidebarTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function StatCard({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  detail: string;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: `${color}22` }]}>
        <Text style={[styles.statIcon, { color }]}>{icon}</Text>
      </View>

      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statDetail, { color }]}>{detail}</Text>
    </View>
  );
}

export function MetricLine({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const width = `${Math.max(0, Math.min(value, 100))}%`;

  return (
    <View style={styles.metricLine}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={styles.metricValue}>{value.toFixed(0)}%</Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: width as any,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

export function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      <Text style={styles.sectionSubtitle}>{subtitle}</Text>
    </View>
  );
}

export function DataCard({
  title,
  status,
  children,
  onRemove,
  selected = false,
  onToggleSelect,
}: {
  title: string;
  status: string;
  children: ReactNode;
  onRemove?: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
}) {
  const critico =
    status.toUpperCase().includes("ALTO") ||
    status.toUpperCase().includes("ALERTA") ||
    status.toUpperCase().includes("ATENÇÃO") ||
    status.toUpperCase().includes("CRÍTICO") ||
    status.toUpperCase().includes("CRITICO");

  return (
    <View style={[styles.dataCard, selected && styles.dataCardSelected]}>
      <View style={styles.dataCardHeader}>
        <View>
          <Text style={styles.dataCardTitle}>{title}</Text>
          <Text style={styles.dataCardSub}>Registro operacional</Text>
        </View>

        <View style={[styles.statusPill, critico && styles.statusPillDanger]}>
          <Text
            style={[
              styles.statusPillText,
              critico && styles.statusPillTextDanger,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.dataCardBody}>{children}</View>

      <View style={styles.cardActions}>
        {onToggleSelect && (
          <TouchableOpacity
            style={[styles.selectButton, selected && styles.selectButtonActive]}
            onPress={onToggleSelect}
          >
            <Text
              style={[
                styles.selectButtonText,
                selected && styles.selectButtonTextActive,
              ]}
            >
              {selected ? "Selecionado" : "Selecionar"}
            </Text>
          </TouchableOpacity>
        )}

        {onRemove && (
          <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
            <Text style={styles.removeButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export function InfoLine({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <View style={styles.infoLine}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: "default" | "numeric";
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
      />
    </View>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>☾</Text>
      <Text style={styles.emptyText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    gap: 12,
  },
  sidebarItemActive: {
    backgroundColor: "#374151",
  },
  sidebarItemDanger: {
    backgroundColor: "#3B2530",
  },
  sidebarIcon: {
    color: "#A7B0C0",
    width: 20,
    textAlign: "center",
    fontWeight: "900",
  },
  sidebarText: {
    color: "#C7CEDB",
    fontWeight: "700",
  },
  sidebarTextActive: {
    color: "#FFFFFF",
  },
  statCard: {
    flex: 1,
    minWidth: 210,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E9EEF6",
    shadowColor: "#64748B",
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  statIconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  statIcon: {
    fontSize: 18,
    fontWeight: "900",
  },
  statValue: {
    color: "#1F2937",
    fontSize: 25,
    fontWeight: "900",
  },
  statLabel: {
    color: "#475569",
    marginTop: 4,
    fontWeight: "800",
  },
  statDetail: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: "800",
  },
  metricLine: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  metricTitle: {
    color: "#475569",
    fontWeight: "800",
  },
  metricValue: {
    color: "#1F2937",
    fontWeight: "900",
  },
  progressBackground: {
    height: 9,
    backgroundColor: "#EEF2F7",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF2F7",
  },
  summaryLabel: {
    color: "#64748B",
    fontWeight: "700",
  },
  summaryValue: {
    color: "#1F2937",
    fontWeight: "900",
  },
  sectionTitle: {
    marginBottom: 20,
  },
  sectionHeading: {
    color: "#1F2937",
    fontSize: 29,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: "#64748B",
    marginTop: 6,
  },
  dataCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E9EEF6",
  },
  dataCardSelected: {
    borderColor: "#7C9DFF",
    backgroundColor: "#F8FAFF",
  },
  dataCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  dataCardTitle: {
    color: "#1F2937",
    fontSize: 17,
    fontWeight: "900",
  },
  dataCardSub: {
    color: "#94A3B8",
    marginTop: 4,
    fontSize: 12,
  },
  statusPill: {
    backgroundColor: "#EEF3FF",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 999,
    height: 31,
  },
  statusPillDanger: {
    backgroundColor: "#FFF1F2",
  },
  statusPillText: {
    color: "#4F6FEB",
    fontSize: 11,
    fontWeight: "900",
  },
  statusPillTextDanger: {
    color: "#E05263",
  },
  dataCardBody: {
    marginTop: 16,
    gap: 8,
  },
  cardActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#EEF3FF",
    borderRadius: 13,
    padding: 12,
  },
  selectButtonActive: {
    backgroundColor: "#7C9DFF",
  },
  selectButtonText: {
    color: "#4F6FEB",
    textAlign: "center",
    fontWeight: "900",
  },
  selectButtonTextActive: {
    color: "#FFFFFF",
  },
  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  infoLabel: {
    color: "#64748B",
    fontWeight: "700",
  },
  infoValue: {
    color: "#1F2937",
    fontWeight: "800",
    flex: 1,
    textAlign: "right",
  },
  removeButton: {
    flex: 1,
    backgroundColor: "#FFF1F2",
    borderRadius: 13,
    padding: 12,
  },
  removeButtonText: {
    color: "#E05263",
    textAlign: "center",
    fontWeight: "900",
  },
  inputGroup: {
    marginBottom: 4,
  },
  inputLabel: {
    color: "#475569",
    fontWeight: "900",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1F2937",
    borderRadius: 14,
    padding: 14,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E9EEF6",
  },
  emptyIcon: {
    fontSize: 36,
    color: "#94A3B8",
  },
  emptyText: {
    color: "#64748B",
    marginTop: 10,
    fontWeight: "700",
  },
});