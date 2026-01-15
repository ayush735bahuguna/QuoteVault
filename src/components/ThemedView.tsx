import { View, ViewProps } from 'react-native';

/**
 * A View component that acts as a container.
 * Previously manipulated theme vars, now a pass-through.
 */
export function ThemedView({ style, children, ...props }: ViewProps) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}
