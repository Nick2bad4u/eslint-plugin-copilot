const MADGE_VERSION = "8.0.0";
const ORIGINAL_TYPESCRIPT_PEER_RANGE = "^5.4.4";
const REPAIRED_TYPESCRIPT_PEER_RANGE = "^5.4.4 || ^6.0.2";

/**
 * Temporarily correct Madge's optional TypeScript peer range until its
 * TypeScript 6 compatibility update is published.
 *
 * Upstream tracking:
 *
 * - https://github.com/pahen/madge/pull/460
 * - https://github.com/pahen/madge/issues/462
 * - https://github.com/pahen/madge/issues/463
 *
 * Remove this repair after upgrading to a Madge release that declares a
 * TypeScript 6 peer range and passes this repository's path-alias checks.
 *
 * @typedef {{
 *     name?: string;
 *     peerDependencies?: Record<string, string>;
 *     version?: string;
 * }} PackageManifest
 */

/**
 * @param {PackageManifest} packageManifest
 * @param {{ log: (message: string) => void }} context
 *
 * @returns {PackageManifest}
 */
export function transformManifest(packageManifest, context) {
    if (packageManifest.name !== "madge") {
        return packageManifest;
    }

    if (packageManifest.version !== MADGE_VERSION) {
        throw new Error(
            `Madge changed from ${MADGE_VERSION} to ${packageManifest.version ?? "an unknown version"}; remove or revalidate the temporary TypeScript peer repair.`
        );
    }

    const declaredPeerRange = packageManifest.peerDependencies?.["typescript"];
    if (declaredPeerRange !== ORIGINAL_TYPESCRIPT_PEER_RANGE) {
        throw new Error(
            `Madge's TypeScript peer range changed from ${ORIGINAL_TYPESCRIPT_PEER_RANGE} to ${declaredPeerRange ?? "an undefined range"}; remove or revalidate the temporary repair.`
        );
    }

    packageManifest.peerDependencies = {
        ...packageManifest.peerDependencies,
        typescript: REPAIRED_TYPESCRIPT_PEER_RANGE,
    };
    context.log(
        `Repaired madge@${MADGE_VERSION} TypeScript peer range to ${REPAIRED_TYPESCRIPT_PEER_RANGE}.`
    );

    return packageManifest;
}
